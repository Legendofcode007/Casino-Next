import NextAuth from "next-auth";
import { findOneByEmail, UpdateLastLoginById } from "../database/users";
import { hasBannedIPOrUserId } from "../database/banned_users";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import requestIp from "request-ip";
import getConfig from 'next/config'
import { connectToDatabase } from "../database/connection";
import { AuthenticatedUser } from "../dto/AuthenticatedUserDto"

const { serverRuntimeConfig } = getConfig()

const superadminInfo = {
  email: serverRuntimeConfig.SUPER_ADMIN_EMAIL,
  password: serverRuntimeConfig.SUPER_ADMIN_PWD
}

export const defaultSuperAdminInfo:AuthenticatedUser = {
  id: 0,
  email: superadminInfo.email,
  role: 'super_admin',
  name: 'Super Admin',
  nick_name: 'super_admin',
  approved: true,
}

export const getOptions = (req) => ({
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  providers: [
    CredentialsProvider({
      authorize: async (credentials: {email:string,password:string}, req) => {
        const pool = await connectToDatabase();

        const { email, password} = credentials;
        //////////////////

        console.log(email,password,superadminInfo)
        if (email === superadminInfo.email && password == superadminInfo.password ) {
          return defaultSuperAdminInfo;
        }
        //////////////////

        const user = await findOneByEmail(pool)(credentials.email);

        if (!user)
          throw new Error("Not Matched email or password");
        
        let ip = requestIp.getClientIp(req)
        
        if(ip && await hasBannedIPOrUserId(pool)(ip,user.id)) {
          throw new Error("Access is forbidden for this user/ip");
        }
        if (!user.is_active)
          throw new Error("승인 대기중입니다.");


        const verifyPassword = await compare(
          credentials.password,
          user.password
        );

        if (!verifyPassword) throw new Error("Not Matched email or password");
        
        await UpdateLastLoginById(pool)(user.id,new Date());
        
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          nick_name: user.nick_name,
          approved: user.approved
        } as AuthenticatedUser;
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
  /*
pages: {
  error: '/my-error-page?error=invalid login',
},*/
  callbacks: {
    jwt: async ({ token, user, account }) => {
    
      user && (token.user = user);
     
      return token;
    },

    redirect: async ({ url }) => {
      return url;
    },


    session: async ({ session, token }) => {

      session.user = token.user;
      return session;
    },
  },
});

