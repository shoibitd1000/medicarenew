import { useState } from "react";
import { Button } from "../../../components/components/ui/button";
import {
  Card,
  CardContent,
} from "../../../components/components/ui/card";
import { PlusCircle, Bell, Trash2, Edit } from "lucide-react";
import React from "react";
import {
  DialogBox,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "../../../components/components/ui/dialog";
import { Input } from "../../../components/components/ui/input";

import { Switch } from "../../../components/components/ui/switch";
import { useToast } from "../../../hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../../components/components/ui/tabs";

const initialReminders = [
  {
    id: 1,
    title: "Take Morning Medication",
    description: "Take 1 pill of Metformin after breakfast.",
    date: "2024-10-26",
    time: "09:00",
    isActive: true,
    schedulerType: "daily",
  },
  {
    id: 2,
    title: "Dr. Smith Follow-up",
    description:
      "Check blood pressure and upload to portal before appointment.",
    date: "2024-10-28",
    time: "15:00",
    isActive: true,
    schedulerType: "once",
  },
  {
    id: 3,
    title: "Annual Health Checkup",
    description: "Fasting is required from midnight.",
    date: "2024-09-15",
    time: "08:00",
    isActive: false,
    schedulerType: "once",
  },
];

export default function ReminderPage() {
  const [reminders, setReminders] = useState(initialReminders);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [schedulerType, setSchedulerType] = useState("once");

  const activeReminders = reminders.filter((r) => r.isActive);
  const inactiveReminders = reminders.filter((r) => !r.isActive);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setSchedulerType("once");
    setIsEditing(null);
  };

  const handleAddClick = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (reminder) => {
    setIsEditing(reminder.id);
    setTitle(reminder.title);
    setDescription(reminder.description);
    setDate(reminder.date);
    setTime(reminder.time);
    setSchedulerType(reminder.schedulerType);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
    toast({
      title: "Reminder Deleted",
      description: "The reminder has been successfully removed.",
    });
  };

  const handleToggleActive = (id, isActive) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, isActive } : r)));
    toast({
      title: `Reminder ${isActive ? "Activated" : "Deactivated"}`,
      description: "The status of the reminder has been updated.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing !== null) {
      setReminders(
        reminders.map((r) =>
          r.id === isEditing
            ? { ...r, title, description, date, time, schedulerType }
            : r
        )
      );
      toast({
        title: "Reminder Updated",
        description: "Your changes have been saved.",
      });
    } else {
      const newReminder = {
        id: Date.now(),
        title,
        description,
        date,
        time,
        isActive: true,
        schedulerType,
      };
      setReminders([newReminder, ...reminders]);
      toast({
        title: "Reminder Added",
        description: "A new reminder has been created.",
      });
    }
    resetForm();
    setIsFormOpen(false);
  };

  const ReminderCard = ({ reminder }) => (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Bell className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-lg">{reminder.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(reminder.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {reminder.time}
              </p>
              {reminder.description && (
                <p className="mt-2 text-sm">{reminder.description}</p>
              )}
            </div>
          </div>
          <Switch
            checked={reminder.isActive}
            onCheckedChange={(checked) =>
              handleToggleActive(reminder.id, checked)
            }
            aria-label="Toggle reminder status"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(reminder)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDelete(reminder.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline text-primary">
          Reminders
        </h1>
        <p className="text-muted-foreground">
          Manage your personal health reminders.
        </p>
      </div>

      <DialogBox
        open={isFormOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          setIsFormOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 rounded-full shadow-lg h-14 w-14 sm:h-16 sm:w-auto p-0 sm:px-6"
          >
            <PlusCircle className="h-6 w-6 sm:mr-2" />
            <span className="hidden sm:inline">Add Reminder</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Reminder" : "New Reminder"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title">Reminder Name</label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Reminder name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="schedulerType">Type Of Scheduler</label>
                <Select value={schedulerType} onValueChange={setSchedulerType}>
                  <SelectTrigger id="schedulerType">
                    <SelectValue placeholder="Select scheduler type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="date">Start Date</label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time">Start Time</label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="my-3">
                  <label>Description(Optional) </label>
                  <CustomTextArea
                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                    value={""}
                    onChange={(e) => setDescription(e.target.value)}
                    placeHolderText={"e.g., Take 1 pill after breakfast....."}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Add Reminder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogBox>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeReminders.length > 0 ? (
            <div className="space-y-4">
              {activeReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground bg-card rounded-lg">
              <p>No active reminders.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="inactive">
          {inactiveReminders.length > 0 ? (
            <div className="space-y-4">
              {inactiveReminders.map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground bg-card rounded-lg">
              <p>No inactive reminders.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
