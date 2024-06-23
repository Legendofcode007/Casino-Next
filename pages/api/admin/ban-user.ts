import type { NextApiRequest, NextApiResponse } from "next";
import { updateUser } from "../../../database/users";
import { insertUser } from "../../../database/banned_users";
let dateTime = require("node-datetime");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let { id,ip,banned_by_id,banned_by_type } = req.body;    

    let dt = dateTime.create();
    let date_time = dt.format("Y-m-d H:M:S");
    
    let obj = {
      is_active: 0,
      approved: 'false'
    };
    obj.updated_at = date_time;
    await updateUser(id, obj);

    if (banned_by_type == 'super_admin')
      banned_by_id=0
    
    obj = {
      user_id: id,
      ip: ip,
      banned_by_id: banned_by_id,
      banned_by_type: banned_by_type,
      created_at: date_time
    };
    await insertUser(obj);

    res.status(201).json({ message: "User banned" });

  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
