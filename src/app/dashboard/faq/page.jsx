import React, { useState } from "react";

const faqs = [
  {
    question: "What are the hospitals visiting hours?",
    answer:
      "Most departments allow visitors between 10:00 AM and 8:00 PM. However, visiting hours may vary by department (ICU, maternity, etc.). Please check with the specific department or call our front desk.",
  },
  {
    question: "How do I book an appointment with a doctor?",
    answer:
      "Go to the 'Appointments' section in the app, select the specialty or doctor, choose an available slot, and confirm the booking.",
  },
  {
    question: "Can I contact my doctor through the app?",
    answer:
      "Yes, you can send a message or request a callback through the 'Messages' or 'Consult Now' feature, if your doctor allows it.",
  },
  {
    question: "Can I view my test results in the app?",
    answer:
      "Yes, test results and reports are available in the 'Lab Reports' or 'Health Records' section.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg divide-y">
      <h2 className="text-xl font-bold p-4">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="border-t">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center p-4 text-left font-medium text-blue-600 focus:outline-none"
          >
            {faq.question}
            <span className="ml-2">{openIndex === index ? "−" : "+"}</span>
          </button>
          {openIndex === index && (
            <div className="p-4 text-gray-600 bg-gray-50">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
