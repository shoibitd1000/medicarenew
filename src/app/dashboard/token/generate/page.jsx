
import { Button } from "../../../../components/components/ui/button";
import React from "react";
import { ChevronRight, MoveLeft, LaptopMinimal  } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function GenerateTokenPage() {
  const navigate = useNavigate();
  const recordTypes = [
    { name: "Kiosk OPD" },
    { name: "Ngito" },
    // { name: "Tenwek Annex" },
    // { name: "Tenwek Hospital" },
  ];

  const handleSave = (e) => {
    e.preventDefault();

    alert("New token generated and saved!");
    navigate("token");
  };

  const token = true

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {token ? (<div>
        <Button variant={"outline"} onClick={() => navigate("/token")} className="flex items-center my-3">
          <MoveLeft className="mr-2 h-4 w-4" /> Back to Centers
        </Button>
        <div className="flex justify-center">
          <div>
            <h3 className="text-lg font-bold  text-primary text-center">Select a Kiosk</h3>
            <p className="text-xs mb-3 font-semibold">Please select a Kiosk to Proceed</p>
          </div>
        </div>
        <div className=" grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          {recordTypes.map((record) => (
            <Link
              to={"/token/verification"}
              key={record.name}
              className="flex items-center justify-between bg-white p-4 shadow-sm hover:shadow-md transition rounded-md"
            >
              <div className="flex items-center gap-4">
                <LaptopMinimal  className="h-6 w-6 text-primary bg-slate-300 rounded-sm" />
                <span className="text-lg font-medium">{record.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>) : (<div className="flex justify-center items-center h-100">
        <div>
          <h1 className="text-xl font-headline text-primary py-3">
            No Kiosk Available
          </h1>
          <div className="text-center">
            <Button variant="outline" onClick={() => navigate("/token")}>
              <MoveLeft className="mr-2 h-4 w-4" /> Back to Centers
            </Button>
          </div>
        </div>
      </div>)}


      {/* <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Token Generation Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value="BEATRICE CHEPKORIR" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile No</Label>
                <Input id="mobile" value="0115983283" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-category">Service Category</Label>
                <Select>
                  <SelectTrigger id="service-category">
                    <SelectValue placeholder="--Select--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="investigation">Investigation</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opd">OPD</SelectItem>
                    <SelectItem value="ipd">IPD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="service">Service</Label>
                <Select>
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Physician</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card> */}



      {/* {token ? "":} */}


    </div>
  );
}
