const express = require("express");

const auth = require("../middleware/auth");
const {
  controllers: { postLogin, postRegister },
} = require("../controller/auth/authController");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).max(12).required(),
  email: Joi.string().email().required(),
});

router.post("/register", validator.body(registerSchema), postRegister);

router.post("/login", validator.body(loginSchema), postLogin);

module.exports = router;
