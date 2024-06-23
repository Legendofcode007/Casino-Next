import type { NextApiRequest, NextApiResponse } from "next";
import { findNoticeById } from "../../../database/notice_board";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {

    let { id } = req.query;    
  
    let data = await findNoticeById(id);

    res.status(200).json(data);
  } else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;
