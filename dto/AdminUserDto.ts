import { ExcludeSuperAdminUserRoleZ, UserRole, UserRolez } from "../entities/user";
import { z } from "zod"
import { UserPasswordZ } from "./RegisterUserBodyDto";

export const CreaeteUserBodyDtoZ = z.object({
  name: z.string().min(2,"이름은 최소 2자에서 12자 이하로 입력하세요").max(12,"이름은 최소 3자에서 12자 이하로 입력하세요"),
  email: z.string().max(50).email("이메일 형식이 올바르지 않습니다."),
  password: UserPasswordZ,
  nick_name: z.string().min(3,"닉네임은 최소 3자에서 12자 이하힙니다.").max(12,"닉네임은 최소 3자에서 12자 이하힙니다.").regex(/^[a-z|A-Z|\d|_]+$/gi,'닉네임은 영문 대소문자,숫자,특수문자(_)만 가능합니다.'),
  role: ExcludeSuperAdminUserRoleZ,
  winning_limit: z.coerce.number().min(0).optional().default(0).transform(String),
  betting_limit: z.coerce.number().min(0).optional().default(0).transform(String),
  approved: z.boolean().default(false).optional(),
  balance: z.coerce.number().min(0),
  point: z.coerce.number().min(0),
  phone: z.string().regex(/^01[0-9]+$/).max(11),
  phone_verified: z.coerce.boolean().optional(),
  casino_ggr: z.coerce.number().min(0).optional().default(0),
  slot_ggr: z.coerce.number().min(0).optional().default(0),
  casino_rolling: z.coerce.number().min(0).optional().default(0),
  slot_rolling: z.coerce.number().min(0).optional().default(0),
  reseller_id: z.coerce.number().optional()
})

export type CreateUserBodyDto = z.infer<typeof CreaeteUserBodyDtoZ>;


export const UpdateUserBodyZ = CreaeteUserBodyDtoZ.omit({
  email:true,
  nick_name:true,
  role:true,
  password:true
}).merge(z.object({
  password: UserPasswordZ.optional().nullable()
}))

export type UpdateUserBody = z.infer<typeof UpdateUserBodyZ>;