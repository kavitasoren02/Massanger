import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUser = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name should only contain alphabetic letters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name should only contain alphabetic letters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits")
    .isNumeric()
    .withMessage("Mobile number must be numeric"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long"),

  body("profilePic")
    .optional()
    .isURL()
    .withMessage("Profile pic must be a valid URL"),

  body("status").optional().isString().withMessage("Status must be string"),

  body("isOnline")
    .optional()
    .isBoolean()
    .withMessage("isOnline must be a bollean value"),

  body("lastSeen")
    .optional()
    .isISO8601()
    .withMessage("last seen must be a valid date"),
];

(req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
