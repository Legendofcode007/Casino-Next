import { z } from "zod";
import { DepositHistoryStatusZ } from "../entities/deposit_history";



export const UpdateDepositHistoryBodyZ = z.object({
  status: DepositHistoryStatusZ,
  deposit_point: z.coerce.number().min(0).optional()
})

export type UdpateDepositHistoryBody = z.infer<typeof UpdateDepositHistoryBodyZ>;