import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {

    let {start_value, end_value} = req.body;
    //console.log('start_value, end_value', start_value, end_value);

    let obj = {
      start_value: start_value,
      end_value: end_value
    }


    res.status(200).json({ message: "Success" }); 

  }
    
    
  else {
    return res.status(405).json({ message: "Method not allowed." });
  }
};

export default handler;