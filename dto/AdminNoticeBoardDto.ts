import { z } from "zod";



export const CreateNoticeBodyZ = z.object({
  message: z.string(),
  subject: z.string()
})

export type CreateNoticeBody = z.infer<typeof CreateNoticeBodyZ>;