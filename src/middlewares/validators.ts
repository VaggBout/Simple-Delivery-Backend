import { body, param } from "express-validator";

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

const loginValidator = [
    body("email")
        .normalizeEmail()
        .isEmail()
        .withMessage("Must be a valid email"),
    body("password")
        .isString()
        .isLength({ min: 5, max: 30 })
        .withMessage("Password should be 5-30 characters"),
];

const createStoreValidator = [
    body("name")
        .isString()
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Must be a valid string"),
];

const createCategoryValidator = [
    body("name")
        .isString()
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Must be a valid string"),
    body("store").isMongoId().trim().escape(),
    body("products").isArray({ min: 2 }),
    body("products.*.name")
        .isString()
        .not()
        .isEmpty()
        .trim()
        .escape()
        .withMessage("Must be a valid string"),
    body("products.*.price")
        .isFloat({ min: 0.01 })
        .withMessage("Must be a valid price"),
    body("products.*.description").not().isEmpty().trim().escape(),
];

const publishStoreValidator = [param("id").isMongoId()];

export {
    registerValidator,
    loginValidator,
    createStoreValidator,
    createCategoryValidator,
    publishStoreValidator,
};
