"use server";

/**
 * @fileOverview AI flow to prioritize notifications based on importance.
 *
 * - prioritizeNotifications - A function that prioritizes a list of notifications.
 * - PrioritizeNotificationsInput - The input type for the prioritizeNotifications function.
 * - PrioritizeNotificationsOutput - The return type for the prioritizeNotifications function.
 */

// import { ai } from "../../ai/genkit";
import z from "zod";

const NotificationSchema = z.object({
  id: z.string().describe("Unique identifier for the notification."),
  title: z.string().describe("Title of the notification."),
  body: z.string().describe("Body text of the notification."),
  timestamp: z
    .string()
    .describe("Timestamp of when the notification was created."),
  type: z
    .string()
    .describe("Type of notification (e.g., appointment, bill, reminder)."),
});

const PrioritizeNotificationsInputSchema = z.object({
  notifications: z
    .array(NotificationSchema)
    .describe("An array of notifications to prioritize."),
});
export type PrioritizeNotificationsInput = z.infer<
  typeof PrioritizeNotificationsInputSchema
>;

const PrioritizedNotificationSchema = NotificationSchema.extend({
  priorityScore: z
    .number()
    .describe(
      "A score indicating the priority of the notification (higher is more important)."
    ),
  reason: z.string().describe("Reason for the assigned priority score."),
});

const PrioritizeNotificationsOutputSchema = z.object({
  prioritizedNotifications: z
    .array(PrioritizedNotificationSchema)
    .describe(
      "An array of notifications with assigned priority scores and reasons."
    ),
});
export type PrioritizeNotificationsOutput = z.infer<
  typeof PrioritizeNotificationsOutputSchema
>;

// export async function prioritizeNotifications(
//   input: PrioritizeNotificationsInput
// ): Promise<PrioritizeNotificationsOutput> {
//   return prioritizeNotificationsFlow(input);
// }

// const prioritizeNotificationsPrompt = ai.definePrompt({
//   name: "prioritizeNotificationsPrompt",
//   input: { schema: PrioritizeNotificationsInputSchema },
//   output: { schema: PrioritizeNotificationsOutputSchema },
//   prompt: `You are an AI assistant designed to prioritize mobile app notifications for users so they can focus on the most important updates and reminders first.

//   Given the following list of notifications, analyze each one and assign a priority score and a reason for that score. Higher scores indicate higher priority. Consider the notification type, timestamp, and content when determining priority. Notifications related to upcoming appointments or urgent bills should be prioritized higher than general reminders or promotional messages.

//   Notifications:
//   {{#each notifications}}
//   - ID: {{this.id}}
//     Title: {{this.title}}
//     Body: {{this.body}}
//     Timestamp: {{this.timestamp}}
//     Type: {{this.type}}
//   {{/each}}

//   Prioritized Notifications (Output):
//   {
//     "prioritizedNotifications": [
//       {{#each notifications}}
//       {
//         "id": "{{this.id}}",
//         "title": "{{this.title}}",
//         "body": "{{this.body}}",
//         "timestamp": "{{this.timestamp}}",
//         "type": "{{this.type}}",
//         "priorityScore": (Assign a score between 1-10 based on the importance of the notification),
//         "reason": "(Explain why this notification received this score)"
//       }{{/each}}
//     ]
//   }
//   `,
// });

// const prioritizeNotificationsFlow = ai.defineFlow(
//   {
//     name: "prioritizeNotificationsFlow",
//     inputSchema: PrioritizeNotificationsInputSchema,
//     outputSchema: PrioritizeNotificationsOutputSchema,
//   },
//   async (input) => {
//     const { output } = await prioritizeNotificationsPrompt(input);
//     return output!;
//   }
// );
