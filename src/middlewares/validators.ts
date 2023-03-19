import { body } from "express-validator";

const registerValidator = [
    body("name")
        .isString()
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Must be a valid string"),
    body("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be a valid email"),
    body("address").isString().withMessage("Must be a valid address"),
    body("password")
        .isString()
        .isLength({ min: 5, max: 30 })
        .withMessage("Password should be 5-30 characters"),
];

export { registerValidator };
