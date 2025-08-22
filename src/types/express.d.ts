import { tokenDataInterface } from "./token";

declare global {
  namespace Express {
    interface Request {
      user?: tokenDataInterface; // ✅ এখন থেকে req.user থাকবে
    }
  }
}
