import { z } from "zod";
import { UpdateBankBodyDtoZ as DtoZ } from "./BankDto"


export const UpdateBankBodyDtoZ = DtoZ;

export type UpdateBankBodyDto = z.infer<typeof UpdateBankBodyDtoZ>;