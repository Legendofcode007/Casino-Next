import type { NextApiRequest, NextApiResponse } from "next";
import { insertNotice } from "../../../database/notice_board";
let dateTime = require("node-datetime");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let { subject, message } = req.body;   
    let dt = dateTime.create();
    let date_time = dt.format("Y-m-d H:M:S");
    
    let obj = 
      { subject: subject, message: message, created_at: date_time};
    await insertNotice(obj);

    res.status(201).json({ message: "Notice created" });

  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;