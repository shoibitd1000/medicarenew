
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircleWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const starLabels: { [key: number]: string } = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
};

interface Complaint {
    id: number;
    subject: string;
    description: string;
    rating: number;
    date: string;
}

const initialComplaints: Complaint[] = [
    {
        id: 1,
        subject: 'Long wait time at OPD',
        description: 'I had to wait for over an hour to see the doctor, even with an appointment.',
        rating: 2,
        date: '2024-07-28T10:30:00Z',
    },
    {
        id: 2,
        subject: 'Excellent nursing care',
        description: 'The nurses in the IPD wing were very attentive and caring during my mother\'s stay.',
        rating: 5,
        date: '2024-07-25T15:00:00Z',
    },
     {
        id: 3,
        subject: 'Billing Error',
        description: '',
        rating: 3,
        date: '2024-07-22T12:00:00Z',
    },
];

const StarRating = ({ rating, setRating, readOnly = false }: { rating: number, setRating?: (rating: number) => void, readOnly?: boolean }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readOnly && setRating?.(star)}
                        className={cn(
                            "p-1 rounded-full transition-colors",
                            !readOnly && "hover:bg-yellow-200",
                            readOnly && "cursor-default"
                        )}
                        disabled={readOnly}
                    >
                        <Star
                            className={cn(
                                "w-8 h-8",
                                rating >= star
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-muted-foreground/50",
                                !readOnly && "cursor-pointer"
                            )}
                        />
                    </button>
                ))}
            </div>
             {starLabels[rating] && (
                <p className="text-sm text-muted-foreground mt-2 font-semibold">
                    {rating}/5 - {starLabels[rating]}
                </p>
            )}
        </div>
    );
};

const ClientSideDate = ({ dateString }: { dateString: string }) => {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(dateString).toLocaleString());
    }, [dateString]);

    return <>{formattedDate}</>;
}


export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || rating === 0) {
            toast({
                title: "Incomplete Submission",
                description: "Please provide a subject and a rating.",
                variant: "destructive",
            });
            return;
        }
        const newComplaint: Complaint = {
            id: Date.now(),
            subject,
            description,
            rating,
            date: new Date().toISOString(),
        };
        setComplaints([newComplaint, ...complaints]);
        setSubject('');
        setDescription('');
        setRating(0);
        toast({
            title: "Feedback Submitted",
            description: "Thank you for your feedback. We will look into it.",
        });
    };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <MessageCircleWarning className="h-12 w-12 mx-auto text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary mt-2">
          Complaints & Feedback
        </h1>
        <p className="text-muted-foreground">
          We value your opinion. Please let us know how we're doing.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Submit New Feedback</CardTitle>
          <CardDescription>
            Use this form to submit a new complaint or share your feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Issue with billing, a suggestion, etc."
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details here..."
                rows={4}
              />
            </div>
            <div className="space-y-4">
                 <Label className="text-base text-center block">Overall Rating</Label>
                 <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="flex justify-end">
                <Button type="submit" size="lg">Submit Feedback</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-headline text-center">Feedback History</h2>
         {complaints.length > 0 ? (
            <div className="space-y-4">
                {complaints.map((complaint) => (
                    <Card key={complaint.id} className="shadow-md">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-bold text-lg text-primary">{complaint.subject}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Submitted on: <ClientSideDate dateString={complaint.date} />
                                    </p>
                                </div>
                                 <StarRating rating={complaint.rating} readOnly />
                            </div>
                            {complaint.description && (
                               <p className="text-sm text-foreground/80 pt-2 border-t border-dashed">
                                    {complaint.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
         ) : (
            <div className="text-center p-8 text-muted-foreground bg-card rounded-lg">
                <p>You have not submitted any feedback yet.</p>
            </div>
         )}
      </div>

    </div>
  );
}
