import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Hospital, Phone, Mail, MapPin } from 'lucide-react';
import { AuthContext } from '../../authtication/Authticate';
import { apiUrls } from '../../../components/Network/ApiEndpoint';
import { notify } from '../../../lib/notify';
import IsLoader from '../../loading';


const ContactUsScreen = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchContact();
  }, [token]);

  const fetchContact = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      setLoader(true);
      const response = await axios.post(
        apiUrls.contactUsapi,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response?.data?.status === true) {
        setData(response?.data?.response);
        setLoader(false)
      } else {
        notify(response.data.message, "error");
      }
    } catch (error) {
      notify(
        error.response?.status,
        error.response?.data || error.message, "error"
      );
    } finally {
      setLoader(false);
    }
  };

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/\\r\\n/g, '\n')
      .replace(/&eacute;/gi, 'é')
      .replace(/&[a-z]+;/gi, '')
      .replace(/undefined+/gi, '')
      .trim();
  };

  return (
    <div className="flex-1  p-4 overflow-auto">
      <h2 className="text-xl md:text-2xl font-bold text-center text-blue-600 my-4">
        Find our hospital centers near you.
      </h2>

      {loader ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <IsLoader isFullScreen={false} text="" size="6" />
        </div>
      ) : (
        <div className="flex flex-wrap justify-between gap-4">
          {data.map((hospital, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 w-full md:w-[48%] shadow-md"
            >
              <div className="flex items-center mb-2">
                <Hospital className="text-blue-600 h-5 w-5" />
                <h3 className="ml-2 text-lg font-bold text-blue-600">
                  {hospital.CentreName}
                </h3>
              </div>
              <p className="text-gray-700 text-sm mb-2">{cleanText(hospital.Details)}</p>
              <div className="flex items-center mb-2">
                <Phone className="text-gray-600 h-4 w-4" />
                <span className="ml-2 text-gray-600 text-sm">{hospital.CallUs}</span>
              </div>
              <div className="flex items-center mb-2">
                <Mail className="text-gray-600 h-4 w-4" />
                <span className="ml-2 text-gray-600 text-sm">{hospital.EmailID}</span>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps?q=${hospital.Latitude},${hospital.Longitude}`,
                    '_blank'
                  )
                }
                className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg mt-3 hover:bg-blue-700 transition"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Get Directions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactUsScreen;