import { z } from "zod";
import { Bank } from "../entities/bank"


export type BankInputBody = Pick<Bank, 'acc_name' | 'acc_num' | 'bank_name'>;

export const UpdateBankBodyDtoZ = z.object({
  acc_name:z.string(),
  acc_num:z.string(),
  bank_name:z.string()
})

export type UpdateBankBodyDto = z.infer<typeof UpdateBankBodyDtoZ>
