import { hash } from "bcryptjs";
let dateTime = require("node-datetime");
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyPasswordToken, updateUser } from "../../../database/users";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password, token } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password.trim().length ||
      !token.trim().length
    ) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }

    const user = await verifyPasswordToken(email);
    //console.log("user", user);

    if (!user.length) {
      return res
        .status(422)
        .json({ message: "email " + email + " is not valid" });
    }

    if (user[0].reset_pwd_token != token) {
      return res.status(422).json({ message: "Invalid token" });
    }

    let dt = dateTime.create();
    let date_time = dt.format("Y-m-d H:M:S");

    //console.log("password", password);

    const obj = {
      password: await hash(password, 12),
      updated_at: date_time,
      reset_pwd_token: null,
    };

    //console.log(obj);

    await updateUser(user[0].id, obj);

    res.status(201).json({ message: "Success" });
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};

export default handler;
