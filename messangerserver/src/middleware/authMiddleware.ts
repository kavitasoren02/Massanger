import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
