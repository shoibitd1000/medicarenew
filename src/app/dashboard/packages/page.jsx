import CustomInput from '../../../components/components/ui/CustomInput';
import { ChevronRight, ChevronsRight, SquarePlus } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function PackageInformations() {
  const recordTypes = [
    { packageName: "Opd Package", healthConcern: "Health  Cheakup", price: 589 },
    { packageName: "Opd Package", healthConcern: "Hemoddialysis", price: 0 },
    { packageName: "Opd Package", healthConcern: "Hemoddialysis - 1", price: 763 },

  ];
  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-1">Health Package Information</h2>
        <p className="text-gray-500">Explore Our OPD and IPD  health packages.</p>
      </div>
      <div className='bg-white p-5 rounded-md'>
        <div className="">
          <h2 className="text-lg font-bold  mb-1">Out-Patient Department Packages</h2>
          <p className="text-gray-500 text-xs">Browse our packages for out-patient service and cheakups</p>
        </div>
        <div className="bg-white w-ful md:w-1/2 lg:w-1/4  my-3">
          <CustomInput
            id="userId"
            type="text"
            placeholder="Search By Package Name...."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            required={"required"}
          />
        </div>

        <div className=" grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordTypes.map((record, i) => (
            <Link
              to={""}
              key={i}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-medium uppercase text-blue-400">{record?.packageName}</h2>
              <span className="text-xs font-medium  text-green-400">{record?.healthConcern}</span>
              <div className='flex justify-between items-center'>
                <span className="text-xs font-medium  font-bolder block py-2">{record?.price ? `KES  ${record?.price}` : 0}</span>
                <Link to={"/packages/packages-details"} className=" font-medium  font-bolder  py-2 flex items-center">
                  <span className='text-[12px]'>Details</span> <span><ChevronsRight className='text-[10px]' /></span>
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PackageInformations
