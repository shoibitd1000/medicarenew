"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/components/ui/table";
import { Button } from "../../../../components/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/components/ui/card";
import { ArrowLeft, Pill } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

const medicines = [
  {
    name: "Lisinopril 10mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. John Smith",
    date: "2024-07-15",
  },
  {
    name: "Amlodipine 5mg",
    dosage: "1 tablet daily",
    prescribedBy: "Dr. John Smith",
    date: "2024-07-15",
  },
  {
    name: "Ibuprofen 400mg",
    dosage: "As needed for pain",
    prescribedBy: "Dr. Michael Brown",
    date: "2024-06-22",
  },
];

export default function MedicinesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 p-4">
      <div className="text-center">
        <Pill className="h-12 w-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary mt-2">
          Medicines
        </h1>
        <p className="text-muted-foreground">
          A list of your prescribed medications.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Prescribed Medicines</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((med, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.prescribedBy}</TableCell>
                  <TableCell>{med.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/clinical-record")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clinical Records
        </Button>
      </div>
    </div>
  );
}
