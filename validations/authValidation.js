import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  displayName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("buyer", "seller").optional(),
  phoneNumber: Joi.string().optional(),
  dob: Joi.string().optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  address: Joi.string().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
