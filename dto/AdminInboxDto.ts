import { z } from "zod";


export type AdminSendMailBodyDto = z.infer<typeof AdminSendMailBodyDtoZ>
export const AdminSendMailBodyDtoZ = z.object({
  type: z.enum(["all","bulk",'one']),
  to: z.union([z.array(z.string()),z.string()]).optional(),
  thread_id: z.number().optional().nullable(),
  subject: z.string(),
  message: z.string()
})