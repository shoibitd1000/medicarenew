import React from "react";
import { Link } from "react-router-dom";
import { SquarePlus, ChevronRight } from "lucide-react";

const recordTypes = [
    { name: "Kaboson" },
    { name: "Ngito" },
    { name: "Tenwek Annex" },
    { name: "Tenwek Hospital" },
];

export default function Investigations() {
    return (
        <div className="space-y-8 p-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-1">Book an Investigations</h2>
                <p className="text-gray-500">Please Select a hospital Center to Proceed</p>
            </div>

            <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {recordTypes.map((record) => (
                    <Link
                        to={"/investigations"}
                        key={record.name}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <SquarePlus className="h-6 w-6 text-primary bg-slate-300 rounded-sm" />
                            <span className="text-lg font-medium">{record.name}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
