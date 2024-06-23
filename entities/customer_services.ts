import { z } from "zod";


export const CustomerServiceStatusZ = z.enum(["pending","success"]);
export type CustomerServiceStatus = z.infer<typeof CustomerServiceStatusZ>;

export type CustomerServiceEntity = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  answer_description: string;
  status: CustomerServiceStatus;
  created_at: string;
  processed_at: string;
}