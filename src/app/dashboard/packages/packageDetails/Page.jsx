import { ChevronsRight, FlaskConical } from 'lucide-react';
import React from 'react'

function PackageDetail() {

    return (
        <div className='p-5'>
            <div className=" w-full m-auto md:w-1/2 my-3">
                <div
                    className="p-4 bg-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                    <div className='flex items-center justify-between'>
                        <div>
                            <span className="text-xs font-extrabold uppercase text-blue-400">OPD</span>
                            <h2 className="text-lg font-medium uppercase text-blue-400">Basic Health Cheakup</h2>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium uppercase text-blue-400">KES 7866</h2>
                            <span className="text-[10px] font-extrabold uppercase text-blue-400">Total Package Cost</span>
                        </div>
                    </div>
                    <p className="text-xs font-medium  text-black-400 py-2">A comprehensive Package covering essential Health Paramaters for a routine cheak.</p>
                </div>
            </div>
            <div className=" w-full m-auto md:w-1/2">
                <div
                    className="py-4"
                >
                    <div>
                        <h4 className="text-md font-extrabold ">Package Inclusions</h4>
                        <div className='flex items-center'>
                            <span className="text-sm">
                                <FlaskConical className="w-4 h-4" />
                            </span>

                            <h2 className="text-lg font-bold px-3">Lab</h2>
                        </div>
                    </div>
                    <ul class="list-disc pl-5">
                        <li>US Abdomain </li>
                        <li>Lipid Profile</li>
                        <li>Total Cholestrol </li>
                        <li>Fasting Blood Sugar</li>
                        <li>Liver Function Test</li>
                        <li>COMPLETE BLOOD COUNT (CBC) </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PackageDetail
