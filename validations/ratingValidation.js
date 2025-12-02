import Joi from "joi";

export const ratingSchema = Joi.object({
  userId: Joi.string().required(),
  foodID: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(200).allow("")
});
