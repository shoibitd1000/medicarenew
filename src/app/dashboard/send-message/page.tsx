
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Hospital, UserCog, HelpingHand } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollAreaViewport } from '@/components/ui/scroll-area';

const doctors = [
    { value: "dr. dino", label: "Dr. Dino - General Physician" },
    { value: "dr. amit", label: "Dr. Amit - Orthopedist" },
    { value: "dr. ibrahim", label: "Dr. Ibrahim - ENT Specialist" },
    { value: "dr. juma", label: "Dr. Juma - Dentist" },
];

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'recipient';
    timestamp: Date;
    recipientName?: string;
    avatar?: string;
    initials?: string;
}

const MessageInput = ({ onMessageSend, recipientName, disabled = false, requiresRecipient = false }: { onMessageSend: (message: string, recipient?: string) => void, recipientName: string, disabled?: boolean, requiresRecipient?: boolean }) => {
    const [message, setMessage] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onMessageSend(message, selectedRecipient || recipientName);
            setMessage('');
            if (requiresRecipient) setSelectedRecipient('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background space-y-4">
             {requiresRecipient && (
                 <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a doctor to message" />
                    </SelectTrigger>
                    <SelectContent>
                        {doctors.map(doctor => (
                            <SelectItem key={doctor.value} value={doctor.label}>
                                {doctor.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Write your message to ${selectedRecipient || recipientName.toLowerCase()}...`}
                rows={3}
                required
                disabled={disabled || (requiresRecipient && !selectedRecipient)}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={disabled || !message.trim() || (requiresRecipient && !selectedRecipient)}>Send Message</Button>
            </div>
        </form>
    );
};


const MessageThread = ({ messages }: { messages: Message[] }) => {
     const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <ScrollArea className="h-[400px] bg-muted/30 p-4">
            <ScrollAreaViewport ref={viewportRef} className="h-full w-full">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-end gap-2",
                                msg.sender === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                             {msg.sender === 'recipient' && (
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src={msg.avatar} />
                                   <AvatarFallback>{msg.initials}</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    "max-w-xs md:max-w-md rounded-lg px-4 py-2",
                                    msg.sender === 'user'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card border"
                                )}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs opacity-70 mt-1 text-right">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                             {msg.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                   <AvatarImage src="https://placehold.co/48x48.png" data-ai-hint="user profile" />
                                   <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollAreaViewport>
        </ScrollArea>
    );
};


export default function SendMessagePage() {
    const { toast } = useToast();
    const [hospitalMessages, setHospitalMessages] = useState<Message[]>([]);
    const [doctorMessages, setDoctorMessages] = useState<Message[]>([]);
    const [nurseMessages, setNurseMessages] = useState<Message[]>([]);

    const createMessage = (text: string, sender: 'user' | 'recipient', recipientName?: string, avatar?: string, initials?: string): Message => ({
        id: Date.now() + Math.random(),
        text,
        sender,
        timestamp: new Date(),
        recipientName,
        avatar,
        initials
    });

    const simulateReply = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>, recipientName: string, avatar?: string, initials?: string) => {
        setTimeout(() => {
            const reply = createMessage(`Thank you for your message to ${recipientName}. We will get back to you shortly.`, 'recipient', recipientName, avatar, initials);
            setMessages(prev => [...prev, reply]);
        }, 1500);
    }

    const handleHospitalMessage = (message: string, recipient?: string) => {
        const newUserMessage = createMessage(message, 'user');
        setHospitalMessages(prev => [...prev, newUserMessage]);
        simulateReply(setHospitalMessages, "the Hospital", "https://placehold.co/48x48.png", "H");
    };
    
    const handleDoctorMessage = (message: string, recipient?: string) => {
        const newUserMessage = createMessage(message, 'user', recipient);
        setDoctorMessages(prev => [...prev, newUserMessage]);
        simulateReply(setDoctorMessages, recipient || "the Doctor", "https://placehold.co/48x48.png", "Dr");
    };

    const handleNurseMessage = (message: string, recipient?: string) => {
        const newUserMessage = createMessage(message, 'user');
        setNurseMessages(prev => [...prev, newUserMessage]);
        simulateReply(setNurseMessages, "the Nursing Desk", "https://placehold.co/48x48.png", "N");
    };


    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-primary" />
                <h1 className="text-3xl font-bold font-headline text-primary mt-2">
                    Send a Message
                </h1>
                <p className="text-muted-foreground">
                    Communicate directly with our team for your queries.
                </p>
            </div>

            <Tabs defaultValue="hospital" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
                    <TabsTrigger value="hospital"><Hospital className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">Hospital</span></TabsTrigger>
                    <TabsTrigger value="doctor"><UserCog className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">Doctor</span></TabsTrigger>
                    <TabsTrigger value="nurse"><HelpingHand className="mr-0 sm:mr-2" /> <span className="hidden sm:inline">Nurse</span></TabsTrigger>
                </TabsList>
                <TabsContent value="hospital">
                    <Card className="overflow-hidden">
                       <MessageThread messages={hospitalMessages} />
                       <MessageInput recipientName="Hospital" onMessageSend={handleHospitalMessage} />
                    </Card>
                </TabsContent>
                <TabsContent value="doctor">
                    <Card className="overflow-hidden">
                        <MessageThread messages={doctorMessages} />
                        <MessageInput recipientName="Doctor" onMessageSend={handleDoctorMessage} requiresRecipient />
                    </Card>
                </TabsContent>
                 <TabsContent value="nurse">
                    <Card className="overflow-hidden">
                        <MessageThread messages={nurseMessages} />
                        <MessageInput recipientName="Nursing Desk" onMessageSend={handleNurseMessage} />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
