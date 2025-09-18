import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import CustomInput from '../../../components/components/ui/CustomInput';
import { ChevronsRight } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../authtication/Authticate';
import { apiUrls } from '../../../components/Network/ApiEndpoint';
import IsLoader from '../../loading';
import Toaster from '../../../lib/notify';

const PackageInformations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('OPD');
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAuthHeader } = useContext(AuthContext);

  useEffect(() => {
    Search_Package();
  }, [activeTab]);



  const Search_Package = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${apiUrls.opdPackageapi}`, {
        headers: {
          ...getAuthHeader()
        },
      });

      if (response?.data?.status === true) {
        console.log(response?.data?.response, 'package');
        const normalizedData = response.data.response.map(pkg => ({
          ItemID: pkg.ItemID,
          Name: pkg.NAME,
          TestName: pkg.TestName,
          Rate: pkg.ItemRate,
          Type_ID: pkg.Type_ID,
        }));
        setData(normalizedData);
      } else {
        console.error('Unexpected response format:', response.data);
        notify('Error', 'Failed to fetch package data. Please try again.', "error");
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      if (error.response?.status === 401) {
        notify('Session Expired', 'Please log in again.', "warn");
        navigate('/');
      } else {
        notify('Error', 'An error occurred while fetching packages.');
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = data?.filter(pkg =>
    pkg.TestName?.toLowerCase().includes(search.toLowerCase()),
  );

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <>
    <Toaster/>
      <div className="space-y-8 p-6 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#3287C2] mb-1">Health Package Information</h1>
          <p className="text-[#555] text-sm">Explore our OPD and IPD health packages.</p>
        </div>

        {/* Description */}
        <div className="bg-white p-5 rounded-md">
          <h2 className="text-lg font-bold text-[#222] mb-1">
            {activeTab === 'OPD'
              ? 'Out-Patient Department Packages'
              : 'In-Patient Department Packages'}
          </h2>
          <p className="text-[#555] text-xs mb-4">
            {activeTab === 'OPD'
              ? 'Browse our packages for out-patient services and checkups.'
              : 'Browse our packages for in-patient services and treatments.'}
          </p>

          {/* Search Bar */}
          <div className="relative bg-white border border-[#D3D3D3] rounded-lg mb-4 focus-within:border-[#3287C2] focus-within:border-2">
            <CustomInput
              id="search"
              type="text"
              placeholder="Search by package name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none font-medium ${isSearchFocused ? 'focus:ring-2 focus:ring-[#3287C2]' : ''}`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#3287C2]"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="flex justify-center items-center col-span-full py-8">
                <IsLoader isFullScreen={false} text='package Info ...' size='6' />
              </div>
            ) : filteredPackages.length > 0 ? (
              filteredPackages.map((pkg) => (
                <div
                  key={pkg.ItemID}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"

                >
                  <h3 className="text-base font-bold text-[#3287C2] mb-2">{pkg.Name}</h3>
                  <p className="text-sm text-[#444] mb-4">{pkg.TestName}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-sm">KES {pkg.Rate}</span>
                    <div className="flex items-center text-[#3287C2] font-semibold text-xs">
                      <span>Details</span>
                      <Link to={`/packages/packages-details/${pkg.ItemID}`}><ChevronsRight className="ml-1 text-xs" /></Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#555] text-sm col-span-full py-8">...No packages found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageInformations;