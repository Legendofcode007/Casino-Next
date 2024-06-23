import type { NextApiRequest, NextApiResponse } from "next";
import { updateDepositDetails } from "../../../database/deposit_history";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let { id, user_transfer_status } = req.body;   
    
    let obj = {
      user_transfer_status: user_transfer_status
    };

    await updateDepositDetails(id,obj)

    res.status(201).json({ message: "Updated" });

  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;