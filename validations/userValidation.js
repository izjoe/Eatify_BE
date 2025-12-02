import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{9}$/),
  address: Joi.string().max(200)
});
