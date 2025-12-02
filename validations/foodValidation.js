import Joi from "joi";

export const createFoodSchema = Joi.object({
  foodID: Joi.string().required(),
  name: Joi.string().min(2).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  image: Joi.string().allow(""),
  description: Joi.string().min(10).max(300).required()
});

export const updateFoodSchema = Joi.object({
  name: Joi.string().min(2),
  price: Joi.number().positive(),
  category: Joi.string(),
  description: Joi.string().min(10).max(300)
});
