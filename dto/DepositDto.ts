import { z } from "zod";

export type DepositRequestBodyDto = z.infer<typeof DepositRequestBodyDtoZ>

export const DepositRequestBodyDtoZ = z.object({
  amount: z.coerce.number(),
  // acc_name: z.string(),
  // acc_num: z.string(),
  // bank_name: z.string()
})

