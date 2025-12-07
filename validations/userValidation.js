import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  dob: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).optional(),
  address: Joi.string().max(200).optional().allow(''),
  gender: Joi.string().valid('Male', 'Female', 'Other').optional().allow(''),
  phoneNumber: Joi.string().pattern(/^(\+84|0)\d{9}$/).optional().allow(''),
  profileImage: Joi.string().optional().allow(''),
  userName: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).optional(),
  userId: Joi.string().optional() // ✅ Cho phép userId từ middleware
}).options({ stripUnknown: true }); // ✅ Tự động xóa các trường không khai báo
