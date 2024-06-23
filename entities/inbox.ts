import { z } from "zod";


export const InboxStatusZ = z.enum(['read','unread','deleted']);

export type InboxStatus = z.infer<typeof InboxStatusZ>

export type Inbox = {
    id: number;
    user_id: number;
    subject: string;
    message: string;
    status: InboxStatus;
    created_at: Date; 
}


