import createHttpError from "http-errors";
import { Session } from "../db/models/sessionModel.js";
import { User } from "../db/models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw createHttpError(401, "Please provide Authorization header");

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) throw createHttpError(401, "Auth header should be of type Bearer");

    const session = await Session.findOne({ accessToken: token });
    if (!session) throw createHttpError(401, "Session not found");
    if (new Date(session.accessTokenValidUntil).getTime() <= Date.now()) {
      throw createHttpError(401, "Access token expired");
    }

    const user = await User.findById(session.userId);
    if (!user) throw createHttpError(401, "User not found");

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, "Invalid or expired access token"));
  }
};
