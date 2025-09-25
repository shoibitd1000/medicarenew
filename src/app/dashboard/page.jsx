import React, { useContext, useEffect, useState } from "react";
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
import { apiUrls } from "../../components/Network/ApiEndpoint";
import axios from "axios";
import { AuthContext } from "../authtication/Authticate";
import { notify } from "../../lib/notify";
import IsLoader from "../loading";

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
    title: "Ambulance",
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
    color: "bg-cyan-100 text-cyan-600",
    bgColor: "bg-blue-50",
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
    description: "Hospital enquiry",
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

const banner = [
  {
    src: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
    alt: "Advanced heart care services in our state-of-the-art facility.",
    hint: "heart care",
  },
  {
    src: "https://imgk.timesnownews.com/story/iStock-1046447804_12.jpg?tr=w-400,h-300,fo-auto",
    alt: "Expert teleconsultation services for remote healthcare.",
    hint: "teleconsultation",
  },
  {
    src: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
    alt: "Comprehensive health packages for preventive care.",
    hint: "health packages",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI0KUctIK8iNad1yGxzxU3bPmT7t4WFhjw8YXrVfUwm9CFLDrEROv9XIJEg3O6IKl9tTA&usqp=CAU",
    alt: "24/7 ambulance services for emergency care.",
    hint: "ambulance",
  },
];

export default function DashboardPage() {
  const { getAuthHeader } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const getDashboardData = async () => {
    if (!getAuthHeader()) {
      notify("Please log in to access the dashboard.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(apiUrls.welcomeText, {
        headers: getAuthHeader(),
      });
      const data = res.data;
      if (data.status) {
        setData(data.response?.[0]);
      } else {
        notify(data.message || "Failed to fetch dashboard data.", "error");
      }
    } catch (error) {
      notify(error.message || "Something went wrong, please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) return <IsLoader text="" />;

  return (
    <div className="space-y-8 bg-background p-2">
      <div className="banner-container">
        <div className="marquee w-full text-end flex justify-between">
          <span className="font-bold text-primary px-3">
            {data?.Message || "Manage your health easily and securely—anytime, anywhere."}
          </span>
          <span className="font-bold px-3">
            {data?.DescriptionMessage || "Explore our services to stay healthy."}
          </span>
        </div>
      </div>
      <PromoCarousel promotions={banner} />
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
                <CardTitle className="text-sm sm:text-lg font-semibold">
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
  );
}