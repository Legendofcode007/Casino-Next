import { z } from "zod";

export type CreateCustomerServiceBodyDto = z.infer<typeof CreateCustomerServiceBodyDtoZ>

export const CreateCustomerServiceBodyDtoZ = z.object({
  title: z.string().max(45),
  description: z.string().max(1000)
})

