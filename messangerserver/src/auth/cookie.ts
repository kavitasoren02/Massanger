import type { CookieOptions, Application, Request, Response } from "express";
import cookieParser from "cookie-parser";

// default cookie options
const cookieOptions: CookieOptions = {
  maxAge: 9000000,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

// register cookie
export const cookieService = (app: Application): void => {
  app.use(cookieParser());
};

// set cookie
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  option: CookieOptions = {},
): void => {
    const finalCookie: CookieOptions ={ ...cookieOptions, ...option};
    res.cookie(name, value, finalCookie);
};

// get cookie
export const getCookie = (req: Request, name: string): string | undefined => {
    return req.cookies?.[name];
};

//remove cookie
export const removeCookie = (
    res: Response,
    name: string,
    options: CookieOptions = {}
): void => {
    const finalCookie: CookieOptions ={...cookieOptions, ...options};
    res.clearCookie(name, finalCookie);
}