import { Request, Response } from "express";

const mainController = (req: Request, res: Response) => {
  res.json({
    data: "This is a full stack app!",
  })
}

export default mainController
