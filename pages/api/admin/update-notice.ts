import type { NextApiRequest, NextApiResponse } from "next";
import { updateNotice } from "../../../database/notice_board";
let dateTime = require("node-datetime");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let { id, subject, message } = req.body;   
    
    let obj = 
      { subject: subject, message: message };

    await updateNotice(id, obj);

    res.status(201).json({ message: "Notice Updated" });

  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;