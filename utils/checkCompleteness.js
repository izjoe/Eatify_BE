// utils/checkCompleteness.js
// Helper function để kiểm tra store đã hoàn thiện chưa

/**
 * Kiểm tra store có đầy đủ thông tin bắt buộc không
 * Required fields:
 * 1. storeImage (imageUrl) - Ảnh cửa hàng
 * 2. storeName (name) - Tên cửa hàng
 * 3. storeDescription - Mô tả
 * 4. storePhone - Số điện thoại
 * 5. storeEmail - Email
 * 6. storeAddress - Địa chỉ
 * 7. menuCount >= 1 - Ít nhất 1 món ăn
 * 
 * @param {Object} store - Seller/Store document from MongoDB
 * @param {Number} menuCount - Số lượng món ăn trong menu
 * @returns {Object} { isComplete: boolean, missingFields: string[] }
 */
export const checkCompleteness = (store, menuCount = 0) => {
  const missingFields = [];
  
  // Check required string fields
  if (!store.storeImage || store.storeImage.trim() === "") {
    missingFields.push("storeImage");
  }
  if (!store.storeName || store.storeName.trim() === "") {
    missingFields.push("storeName");
  }
  if (!store.storeDescription || store.storeDescription.trim() === "") {
    missingFields.push("storeDescription");
  }
  if (!store.storePhone || store.storePhone.trim() === "") {
    missingFields.push("storePhone");
  }
  if (!store.storeEmail || store.storeEmail.trim() === "") {
    missingFields.push("storeEmail");
  }
  if (!store.storeAddress || store.storeAddress.trim() === "") {
    missingFields.push("storeAddress");
  }
  
  // Check menu count
  if (menuCount < 1) {
    missingFields.push("menu (need at least 1 item)");
  }
  
  const isComplete = missingFields.length === 0;
  
  return {
    isComplete,
    missingFields,
    requiredFields: [
      "storeImage",
      "storeName", 
      "storeDescription",
      "storePhone",
      "storeEmail",
      "storeAddress",
      "menu (at least 1 item)"
    ]
  };
};

/**
 * Cập nhật isComplete status cho store trong database
 * @param {Object} store - Mongoose document
 * @param {Number} menuCount - Số món ăn
 * @returns {Promise<Object>} Updated store
 */
export const updateCompletionStatus = async (store, menuCount) => {
  const { isComplete } = checkCompleteness(store, menuCount);
  
  if (store.isComplete !== isComplete) {
    store.isComplete = isComplete;
    await store.save();
  }
  
  return store;
};

export default checkCompleteness;
