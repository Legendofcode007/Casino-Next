import { z } from "zod"
import { UserRolez } from "../entities/user"
import { CreaeteUserBodyDtoZ } from "./AdminUserDto"


export const UpdateUserBodyDtoZ = CreaeteUserBodyDtoZ.pick({
  name: true
})

export type UpdateUserBodyDto = z.infer<typeof UpdateUserBodyDtoZ>


export const UserMeDtoZ = z.object({
  id: z.coerce.number(),
  gamer_id: z.coerce.number().optional().nullish(),
  email: z.string(),
  name: z.string().optional(),
  nick_name: z.string().optional(),
  role: UserRolez,
  is_active: z.coerce.boolean(),
  approved: z.coerce.boolean(),
  balance: z.coerce.number(),
  point: z.coerce.number(),
  betting_limit: z.coerce.number().optional(),
  winning_limit: z.coerce.number().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  last_login: z.coerce.date().optional()
})

export type UserMeDto = z.infer<typeof UserMeDtoZ>;

export const UserSignupBodyDtoZ = z.object({
  email: z.string().email(),
  referral_code: z.string().optional(),
  bank_name: z.string(),
  acc_num: z.string()
}).merge(CreaeteUserBodyDtoZ.pick({
  email: true,
  name: true,
  nick_name: true,
  phone: true,
  password: true
}))

export type UserSignupBodyDto = z.infer<typeof UserSignupBodyDtoZ>