import { hash } from "bcryptjs";
let dateTime = require("node-datetime");
import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmail, updateUser } from "../../../database/users";
import { forgetPwdMail } from "../../../modules/email/send_email";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "Invalid Email" });
      return;
    }

    const user = await findUserByEmail(email);

    console.log("user", user);

    if (!user.length) {
      return res
        .status(422)
        .json({ message: "email " + email + " is not valid" });
    }

    let dt = dateTime.create();
    let date_time = dt.format("Y-m-d H:M:S");

    let token = await hash(date_time, 12);

    let obj = {
      reset_pwd_token: token,
    };

    //console.log(obj);

    await updateUser(user[0].id, obj);

    await forgetPwdMail(email, token);

    res.status(201).json({ message: "Success" });
  } else {
    res.status(500).json({ message: "Route not valid" });
  }
};

export default handler;
