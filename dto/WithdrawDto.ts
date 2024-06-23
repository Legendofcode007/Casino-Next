import { z } from "zod";
import { DepositRequestBodyDtoZ } from "./DepositDto"
export type WithdrawRequestBodyDto = z.infer<typeof WithdrawRequestBodyDtoZ>

export const WithdrawRequestBodyDtoZ = DepositRequestBodyDtoZ;

