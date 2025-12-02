import Joi from "joi";

export const updateUserRoleSchema = Joi.object({
  userID: Joi.string().required(),
  role: Joi.string()
    .valid("customer", "seller", "admin")
    .required()
});

export const adminUpdateUserSchema = Joi.object({
  userID: Joi.string().required(),
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{9}$/),
  address: Joi.string().max(200)
});
