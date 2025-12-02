import Joi from "joi";

export const createOrderSchema = Joi.object({
  userID: Joi.string().required(),
  items: Joi.array()
    .items(
      Joi.object({
        foodID: Joi.string().required(),
        foodName: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().positive().required()
      })
    )
    .required(),

  totalPrice: Joi.number().positive().required(),
  note: Joi.string().max(200).allow("")
});

export const updateOrderStatusSchema = Joi.object({
  orderID: Joi.string().required(),
  newStatus: Joi.string()
    .valid("pending", "preparing", "shipping", "completed", "canceled")
    .required()
});
