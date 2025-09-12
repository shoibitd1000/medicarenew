import React from "react";
import { Link } from "react-router-dom";
import {
  SquarePlus,
  FlaskConical,
  ReceiptText,
  Heart,
  MessageSquareText,
  Aperture,
  Bus,
  MessagesSquare,
  Package,
  FileText,
  Ticket,
  Mail,
  Receipt,
} from "lucide-react";

import PromoCarousel from "../../components/components/dashboard/promo-carousel";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/components/ui/card";

const features = [
  {
    title: "Doctor Appointment",
    icon: SquarePlus,
    href: "/appointments/book",
    description: "Book & view appointments",
    color: "bg-red-100 text-red-600",
    bgColor: "bg-red-50",
  },
  {
    title: "Teleconsultation",
    icon: Aperture,
    href: "/teleconsultation/book",
    description: "Online video consults",
    color: "bg-pink-100 text-pink-600",
    bgColor: "bg-pink-50",
  },
  /* {
    title: "Cost Eastimate",
    icon: Receipt,
    href: "/cost-estimate",
    description: "Cost Eastimate",
    color: "bg-pink-100 text-pink-600",
    bgColor: "bg-pink-50",
  }, */
  {
    title: "Investigation",
    icon: FlaskConical,
    href: "/investigations/book",
    description: "Schedule investigations",
    color: "bg-purple-100 text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Package Information",
    icon: Package,
    href: "/packages",
    description: "View health packages",
    color: "bg-indigo-100 text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Ambulance ",
    icon: Bus,
    href: "/ambulance",
    description: "Request an ambulance",
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50",

  },
  {
    title: "My Token",
    icon: Ticket,
    href: "/token",
    description: "View your token status",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Clinical Record",
    icon: FileText,
    href: "/clinical-record",
    description: "View your health records",
    bgColor: "bg-yellow-50",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Health Tracker",
    icon: Heart,
    href: "/health-tracker",
    description: "Track your vitals",
    color: "bg-yellow-100 text-yellow-600",
    bgColor: "bg-cyan-50",
  },


  {
    title: "Bill History",
    icon: ReceiptText,
    href: "/bill-history",
    description: "View past bills",
    color: "bg-orange-100 text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Send Message",
    icon: Mail,
    href: "/send-message",
    description: "hospital enquiry",
    color: "bg-sky-100 text-sky-600",
    bgColor: "bg-sky-50",
  },
  {
    title: "Feedback",
    icon: MessageSquareText,
    href: "/feedback",
    description: "Submit feedback",
    color: "bg-teal-100 text-teal-600",
    bgColor: "bg-teal-50",
  },


  {
    title: "FAQ",
    icon: MessagesSquare,
    href: "/faq",
    description: "Most Asked Questions",
    color: "bg-red-100 text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function DashboardPage() {
  return (
    <>

      <div className="space-y-8 bg-background p-2">

        <div className="banner-container">
          <div className="marquee">
            <span className="banner-title">
              Welcome to the Patient Mobile App Powered by ITdose Healthcare
              Solutions
            </span>
            <span className="banner-subtitle">
              Manage your health easily and securely—anytime, anywhere.
            </span>
          </div>
          <div className="marquee marquee2">
            <span className="banner-title">
              Welcome to the Patient Mobile App Powered by ITdose Healthcare
              Solutions
            </span>
            <span className="banner-subtitle">
              Manage your health easily and securely—anytime, anywhere.
            </span>
          </div>
        </div>
        <PromoCarousel />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature) => (
            <Link to={feature.href} key={feature.title}>
              <Card
                className={`h-full hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-center p-2 sm:p-4 ${feature.bgColor} hover:bg-opacity-80`}
              >
                <CardHeader className="p-1 sm:p-2">
                  <div
                    className={`mx-auto p-3 sm:p-4 rounded-full mb-2 sm:mb-3 ${feature.color}`}
                  >
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                  <CardTitle className="text-sm sm:text-lg font-semibold font-bold">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}
