import NextAuth from "next-auth";
import { getOptions } from "../../../utils/getNextAuthOptions"

export default (req, res) => NextAuth(req, res, getOptions(req));
