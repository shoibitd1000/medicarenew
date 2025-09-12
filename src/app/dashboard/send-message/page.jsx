import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/components/ui/card';
import { Textarea } from '../../../components/components/ui/textarea';
import { useToast } from '../../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/components/ui/select';
import { MessageSquare, Hospital, UserCog, HelpingHand } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/components/ui/avatar';
import { cn } from '../../../lib/utils';
import { ScrollArea, ScrollAreaViewport } from '../../../components/components/ui/scroll-area';

import React, { useState, useEffect, useRef } from "react";

const doctors = [
  { value: "dr. dino", label: "Dr. Dino - General Physician" },
  { value: "dr. amit", label: "Dr. Amit - Orthopedist" },
  { value: "dr. ibrahim", label: "Dr. Ibrahim - ENT Specialist" },
  { value: "dr. juma", label: "Dr. Juma - Dentist" },
];

function MessageInput({
  onMessageSend,
  recipientName,
  disabled = false,
  requiresRecipient = false,
}) {
  const [message, setMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onMessageSend(message, selectedRecipient || recipientName);
      setMessage("");
      if (requiresRecipient) setSelectedRecipient("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem", borderTop: "1px solid #ccc" }}>
      {requiresRecipient && (
        <select
          value={selectedRecipient}
          onChange={(e) => setSelectedRecipient(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        >
          <option value="">Select a doctor to message</option>
          {doctors.map((doctor) => (
            <option key={doctor.value} value={doctor.label}>
              {doctor.label}
            </option>
          ))}
        </select>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Write your message to ${
          selectedRecipient || recipientName
        }...`}
        rows={3}
        required
        disabled={disabled || (requiresRecipient && !selectedRecipient)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
      />
      <div style={{ textAlign: "right" }}>
        <button
          type="submit"
          disabled={disabled || !message.trim() || (requiresRecipient && !selectedRecipient)}
          style={{ padding: "0.5rem 1rem" }}
        >
          Send Message
        </button>
      </div>
    </form>
  );
}

function MessageThread({ messages }) {
  const viewportRef = useRef(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={viewportRef}
      style={{
        height: "300px",
        overflowY: "auto",
        background: "#f9f9f9",
        padding: "1rem",
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            display: "flex",
            justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            marginBottom: "0.5rem",
          }}
        >
          {msg.sender === "recipient" && (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.5rem",
              }}
            >
              {msg.initials || "R"}
            </div>
          )}
          <div
            style={{
              maxWidth: "60%",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: msg.sender === "user" ? "#007bff" : "#fff",
              color: msg.sender === "user" ? "#fff" : "#000",
              border: msg.sender === "recipient" ? "1px solid #ccc" : "none",
            }}
          >
            <p style={{ margin: 0 }}>{msg.text}</p>
            <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.7, textAlign: "right" }}>
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {msg.sender === "user" && (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#007bff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "0.5rem",
              }}
            >
              U
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SendMessagePage() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [hospitalMessages, setHospitalMessages] = useState([]);
  const [doctorMessages, setDoctorMessages] = useState([]);
  const [nurseMessages, setNurseMessages] = useState([]);

  const createMessage = (text, sender, recipientName, avatar, initials) => ({
    id: Date.now() + Math.random(),
    text,
    sender,
    timestamp: new Date(),
    recipientName,
    avatar,
    initials,
  });

  const simulateReply = (setMessages, recipientName, initials = "R") => {
    setTimeout(() => {
      const reply = createMessage(
        `Thank you for your message to ${recipientName}. We will get back to you shortly.`,
        "recipient",
        recipientName,
        null,
        initials
      );
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  const handleHospitalMessage = (message) => {
    const newMsg = createMessage(message, "user");
    setHospitalMessages((prev) => [...prev, newMsg]);
    simulateReply(setHospitalMessages, "the Hospital", "H");
  };

  const handleDoctorMessage = (message, recipient) => {
    const newMsg = createMessage(message, "user", recipient);
    setDoctorMessages((prev) => [...prev, newMsg]);
    simulateReply(setDoctorMessages, recipient || "the Doctor", "Dr");
  };

  const handleNurseMessage = (message) => {
    const newMsg = createMessage(message, "user");
    setNurseMessages((prev) => [...prev, newMsg]);
    simulateReply(setNurseMessages, "the Nursing Desk", "N");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h1>Send a Message</h1>
        <p>Communicate directly with our team for your queries.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("hospital")}
          style={{
            flex: 1,
            padding: "0.5rem",
            background: activeTab === "hospital" ? "#007bff" : "#eee",
            color: activeTab === "hospital" ? "#fff" : "#000",
            border: "none",
          }}
        >
          Hospital
        </button>
        <button
          onClick={() => setActiveTab("doctor")}
          style={{
            flex: 1,
            padding: "0.5rem",
            background: activeTab === "doctor" ? "#007bff" : "#eee",
            color: activeTab === "doctor" ? "#fff" : "#000",
            border: "none",
          }}
        >
          Doctor
        </button>
        <button
          onClick={() => setActiveTab("nurse")}
          style={{
            flex: 1,
            padding: "0.5rem",
            background: activeTab === "nurse" ? "#007bff" : "#eee",
            color: activeTab === "nurse" ? "#fff" : "#000",
            border: "none",
          }}
        >
          Nurse
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "hospital" && (
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}>
          <MessageThread messages={hospitalMessages} />
          <MessageInput recipientName="Hospital" onMessageSend={handleHospitalMessage} />
        </div>
      )}
      {activeTab === "doctor" && (
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}>
          <MessageThread messages={doctorMessages} />
          <MessageInput
            recipientName="Doctor"
            onMessageSend={handleDoctorMessage}
            requiresRecipient
          />
        </div>
      )}
      {activeTab === "nurse" && (
        <div style={{ border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}>
          <MessageThread messages={nurseMessages} />
          <MessageInput recipientName="Nursing Desk" onMessageSend={handleNurseMessage} />
        </div>
      )}
    </div>
  );
}
