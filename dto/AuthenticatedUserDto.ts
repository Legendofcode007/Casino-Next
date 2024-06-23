import { User } from "../entities/user"


export type AuthenticatedUser = Pick<User, 'id' | 'name' | 'nick_name' | 'role' | 'email'  | 'approved' >;
