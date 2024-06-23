import { z } from "zod";



export const AnswerCustomerServiceBodyDtoZ = z.object({
  answer_description: z.string()
})