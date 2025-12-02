import Joi from "joi";

export const updateCartSchema = Joi.object({
  userID: Joi.string().required(),
  foodID: Joi.string().required(),
  quantity: Joi.number().min(1).required()
});
