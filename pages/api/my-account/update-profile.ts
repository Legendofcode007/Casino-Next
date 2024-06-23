import type { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "../../../database/users";
import { hash } from "bcryptjs";
let dateTime = require("node-datetime");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let { id, name, password } = req.body;  
    
    let dt = dateTime.create();
    let date_time = dt.format("Y-m-d H:M:S");
    
    let obj = {
      name: name,
      updated_at: date_time
    };

    if (password) {
      password = await hash(password, 12);
      obj.password = password;
    }
 
    await updateUser(id,obj)

    res.status(201).json({ message: "User updated" });

  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;