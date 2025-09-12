import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/components/ui/button'
import CustomInput from '../../../../../components/components/ui/CustomInput'
import { Label } from '../../../../../components/components/ui/label'
import React, {  useState } from 'react'
import CustomTable from '../../../../../components/components/ui/customTabel';
import CustomSelect from '../../../../../components/components/ui/CustomSelect';

function TokenVerification() {
    const [selectedServices,setSelectedServices] = useState()
    const [data, setData] = useState([
        { id: 1, name: "sanjay", email: "6363647333" },
        { id: 2, name: "Rahul", email: "4234324422" },
    ]);

    const Thead = [
        { key: "id", label: "Patient ID" },
        { key: "name", label: "Name" },
        { key: "Mobile", label: "Mobile" },
    ];
    const services = [
        { id: 'Service-1', name: 'Service-1' },
        { id: 'Service-2', name: 'Service-2' },
        { id: 'Service-3', name: 'Service-3' },
        { id: 'Service-4', name: 'Service-4' },
    ];
    /* const actions = [
        {
            label: "Edit",
            onClick: (row) => alert(`Edit ${row.name}`),
        },
        {
            label: "Delete",
            onClick: (row) =>
                setData((prev) => prev.filter((item) => item.id !== row.id)),
        },
    ]; */

    return (
        <div className='max-w-4xl mx-auto space-y-8'>
            <div
                className=" bg-blue-300 p-4 shadow-sm hover:shadow-md transition rounded-md m-3 "
            >
                <div className="flex items-center gap-2">
                    <span className='font-medium text-white'>Center Name :</span>
                    <span className="font-medium text-white">{"Tenwek Hospital"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className='font-medium text-white'>Kiosk Name :</span>
                    <span className="font-medium text-white">{"Kiosk-OPD"}</span>
                </div>
            </div>
            <div
                className=" bg-white p-4 shadow-sm hover:shadow-md transition rounded-md m-3 "
            >
                <Label className='text-md text-primary mb-2'> Patient Lookup</Label>
                <div className="relative flex-grow">
                    <CustomInput
                        id="userId"
                        type="text"
                        placeholder="UHID/Mobile No"
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"

                        required={"required"}
                    />
                    <Button type="button" variant="outline" className="w-full sm:w-auto absolute right-3 top-1/2 -translate-y-1/2 h-8 w-5 ">
                        Verify
                    </Button>
                </div>
            </div>
            <div
                className=" bg-white p-4 shadow-sm hover:shadow-md transition rounded-md m-3 "
            >
                <h3 className='text-md text-primary mb-2'>Patient Details</h3>
                <CustomTable
                    Thead={Thead}
                    data={data}
                    striped
                    bordered
                    hover
                    wrapperClass="rounded-md shadow"
                    tableClass="text-center"
                    headerClass="bg-gray-200"
                    rowClass="even:bg-gray-50"
                    cellClass="text-gray-700"
                />
            </div>
            <div
                className=" bg-white p-4 shadow-sm hover:shadow-md transition rounded-md m-3 "
            >
                <h3 className='text-md text-primary mb-2'>Service Selection</h3>
                <CustomSelect
                    placeholder="Select ambulance type"
                    options={services?.map((type) => ({
                        value: type.id,
                        label: type.name || type.id,
                    }))}
                    value={
                        services?.map((type) => ({
                            value: type.id,
                            label: type.name || type.id,
                        }))
                            .find((d) => d.value === selectedServices) || null
                    }
                    onChange={(selectedOption) => setSelectedServices(selectedOption.value)}
                />
            </div>
        </div>
    )
}

export default TokenVerification
