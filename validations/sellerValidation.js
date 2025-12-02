import Joi from "joi";

export const updateSellerSchema = Joi.object({
  storeName: Joi.string().min(2).max(100),
  storeAddress: Joi.string().min(5).max(200),
  description: Joi.string().max(300).allow(""),
  phone: Joi.string().pattern(/^[0-9]{9}$/)
});
