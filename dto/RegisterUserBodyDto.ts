import { ExcludeSuperAdminUserRoleZ } from "../entities/user";
import { z } from "zod"

export const UserPasswordZ = z.string().min(6,"비밀번호는 최소 6자에서 20자 이하입니다.").max(20,"비밀번호는 최소 6자에서 20자 이하입니다.");

export type RegisterUserBodyDto = {
  name: string;
  email: string; 
  password: string;
  nick_name: string;
}



export const SearchQueryZ = z.object({
  q: z.string().default(''),
  role: ExcludeSuperAdminUserRoleZ.optional()
});

export type SearchQuery = z.infer<typeof SearchQueryZ>;
