// controllers/storeController.js
// Controller xử lý CRUD cho Store của Seller

import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import { checkCompleteness, updateCompletionStatus } from "../utils/checkCompleteness.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// Helper function để kiểm tra ObjectId hợp lệ
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
};

/**
 * GET /api/seller/store/me
 * Lấy store của seller hiện tại
 * Trả về: { ok: true, store } hoặc { ok: true, store: null }
 */
export const getMyStore = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    
    // Tìm store của seller
    const store = await sellerModel.findOne({ userID: userId });
    
    if (!store) {
      return res.status(200).json({
        ok: true,
        success: true,
        store: null,
        message: "No store found. Please create one."
      });
    }

    // Đếm số món ăn
    const menuCount = await foodModel.countDocuments({ sellerID: store.sellerID });
    
    // Lấy menu items
    const menuItems = await foodModel.find({ sellerID: store.sellerID })
      .select("foodID foodName description price foodImage category isAvailable stock");
    
    // Kiểm tra completeness
    const completeness = checkCompleteness(store, menuCount);
    
    // Cập nhật isComplete nếu cần
    if (store.isComplete !== completeness.isComplete) {
      store.isComplete = completeness.isComplete;
      await store.save();
    }

    return res.status(200).json({
      ok: true,
      success: true,
      store: {
        ...store.toObject(),
        menuCount,
        menuItems
      },
      completeness
    });
    
  } catch (error) {
    console.error("getMyStore error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error fetching store",
      error: error.message
    });
  }
};

/**
 * POST /api/seller/store
 * Tạo hoặc cập nhật store
 * Body: { storeName, storeDescription, storeAddress, storeImage, storePhone, storeEmail, ... }
 */
export const createOrUpdateStore = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const {
      storeName,
      storeDescription,
      storeAddress,
      storeImage,
      storePhone,
      storeEmail,
      categories,
      openTime,
      closeTime
    } = req.body;

    // Kiểm tra user tồn tại và là seller
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "User not found"
      });
    }
    
    if (user.role !== "seller") {
      return res.status(403).json({
        ok: false,
        success: false,
        message: "Only sellers can create/update stores"
      });
    }

    // Tìm store hiện có
    let store = await sellerModel.findOne({ userID: userId });
    
    if (store) {
      // ========== UPDATE EXISTING STORE ==========
      if (storeName !== undefined) store.storeName = storeName;
      if (storeDescription !== undefined) store.storeDescription = storeDescription;
      if (storeAddress !== undefined) store.storeAddress = storeAddress;
      if (storeImage !== undefined) store.storeImage = storeImage;
      if (storePhone !== undefined) store.storePhone = storePhone;
      if (storeEmail !== undefined) store.storeEmail = storeEmail;
      if (categories !== undefined) store.categories = categories;
      if (openTime !== undefined) store.openTime = openTime;
      if (closeTime !== undefined) store.closeTime = closeTime;
      
      // Cập nhật completion status
      const menuCount = await foodModel.countDocuments({ sellerID: store.sellerID });
      const { isComplete, missingFields } = checkCompleteness(store, menuCount);
      store.isComplete = isComplete;
      
      await store.save();
      
      return res.status(200).json({
        ok: true,
        success: true,
        message: "Store updated successfully",
        store: store.toObject(),
        completeness: { isComplete, missingFields },
        menuCount
      });
      
    } else {
      // ========== CREATE NEW STORE ==========
      const sellerID = `SELLER_${uuidv4().substring(0, 8).toUpperCase()}`;
      
      store = new sellerModel({
        sellerID,
        userID: userId,
        storeName: storeName || "",
        storeDescription: storeDescription || "",
        storeAddress: storeAddress || "",
        storeImage: storeImage || "",
        storePhone: storePhone || "",
        storeEmail: storeEmail || "",
        categories: categories || [],
        openTime: openTime || "",
        closeTime: closeTime || "",
        isComplete: false
      });
      
      // Check completeness (menuCount = 0 for new store)
      const { isComplete, missingFields } = checkCompleteness(store, 0);
      store.isComplete = isComplete;
      
      await store.save();
      
      // Cập nhật profileCompleted cho user nếu cần
      // (profileCompleted = true khi store isComplete = true)
      
      return res.status(201).json({
        ok: true,
        success: true,
        message: "Store created successfully",
        store: store.toObject(),
        completeness: { isComplete, missingFields },
        menuCount: 0
      });
    }
    
  } catch (error) {
    console.error("createOrUpdateStore error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error creating/updating store",
      error: error.message
    });
  }
};

/**
 * PUT /api/seller/store/:id
 * Cập nhật store theo ID
 */
export const updateStoreById = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params;
    const updateData = req.body;

    // Tìm store và verify ownership - chỉ dùng _id nếu là ObjectId hợp lệ
    const query = isValidObjectId(id) 
      ? { $or: [{ sellerID: id }, { _id: id }] }
      : { sellerID: id };
    const store = await sellerModel.findOne(query);
    
    if (!store) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Store not found"
      });
    }
    
    // Kiểm tra quyền sở hữu - convert to string for proper comparison
    if (store.userID.toString() !== userId.toString()) {
      return res.status(403).json({
        ok: false,
        success: false,
        message: "You don't have permission to update this store"
      });
    }

    // Update các fields được phép
    const allowedFields = [
      "storeName", "storeDescription", "storeAddress", 
      "storeImage", "storePhone", "storeEmail",
      "categories", "openTime", "closeTime", "isActive"
    ];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        store[field] = updateData[field];
      }
    });

    // Recalc completion status
    const menuCount = await foodModel.countDocuments({ sellerID: store.sellerID });
    const { isComplete, missingFields } = checkCompleteness(store, menuCount);
    store.isComplete = isComplete;
    
    await store.save();

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Store updated successfully",
      store: store.toObject(),
      completeness: { isComplete, missingFields },
      menuCount
    });
    
  } catch (error) {
    console.error("updateStoreById error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error updating store",
      error: error.message
    });
  }
};

/**
 * POST /api/seller/store/:id/menu
 * Thêm món ăn vào menu của store
 * Body: { foodName, description, price, foodImage, category, stock }
 */
export const addMenuItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { id } = req.params; // storeId or sellerID
    const { foodName, description, price, foodImage, category, stock } = req.body;

    console.log("📝 addMenuItem called with:", { userId, id, foodName, category, price });
    console.log("📝 foodImage length:", foodImage?.length || 0);

    // Validate required fields
    if (!foodName || !description || price === undefined || !foodImage || !category) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        ok: false,
        success: false,
        message: "Missing required fields: foodName, description, price, foodImage, category"
      });
    }

    // Tìm store và verify ownership - chỉ dùng _id nếu là ObjectId hợp lệ
    console.log("🔍 Looking for store with id:", id);
    const query = isValidObjectId(id) 
      ? { $or: [{ sellerID: id }, { _id: id }] }
      : { sellerID: id };
    const store = await sellerModel.findOne(query);
    
    console.log("🔍 Found store:", store ? { sellerID: store.sellerID, userID: store.userID } : null);
    
    if (!store) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Store not found"
      });
    }
    
    // So sánh userID đúng cách (convert to string)
    console.log("🔐 Comparing userIDs:", { storeUserID: store.userID, tokenUserId: userId });
    if (store.userID.toString() !== userId.toString()) {
      return res.status(403).json({
        ok: false,
        success: false,
        message: "You don't have permission to add menu to this store"
      });
    }

    // Tạo food item
    const foodID = `FOOD_${uuidv4().substring(0, 8).toUpperCase()}`;
    
    console.log("📦 Creating food item:", { foodID, sellerID: store.sellerID, foodName, category, price });
    
    const newFood = new foodModel({
      foodID,
      sellerID: store.sellerID,
      foodName,
      description,
      price: Number(price),
      foodImage,
      category,
      stock: stock !== undefined ? Number(stock) : 10,
      isAvailable: true
    });
    
    console.log("💾 Saving food...");
    await newFood.save();
    console.log("✅ Food saved successfully!");

    // Recalc store completion
    const menuCount = await foodModel.countDocuments({ sellerID: store.sellerID });
    const { isComplete, missingFields } = checkCompleteness(store, menuCount);
    
    console.log("📊 Store completeness:", { isComplete, missingFields, menuCount });
    
    if (store.isComplete !== isComplete) {
      store.isComplete = isComplete;
      await store.save();
    }

    return res.status(201).json({
      ok: true,
      success: true,
      message: "Menu item added successfully",
      food: newFood.toObject(),
      storeCompleteness: { isComplete, missingFields },
      menuCount
    });
    
  } catch (error) {
    console.error("❌ addMenuItem error:", error.message);
    console.error("❌ Full error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error adding menu item",
      error: error.message
    });
  }
};

/**
 * PUT /api/seller/store/:storeId/menu/:menuId
 * Cập nhật món ăn trong menu
 */
export const updateMenuItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { storeId, menuId } = req.params;
    const updateData = req.body;

    // Tìm store và verify ownership - chỉ dùng _id nếu là ObjectId hợp lệ
    const storeQuery = isValidObjectId(storeId) 
      ? { $or: [{ sellerID: storeId }, { _id: storeId }] }
      : { sellerID: storeId };
    const store = await sellerModel.findOne(storeQuery);
    
    if (!store) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Store not found"
      });
    }
    
    if (store.userID.toString() !== userId.toString()) {
      return res.status(403).json({
        ok: false,
        success: false,
        message: "You don't have permission to update this menu"
      });
    }

    // Tìm food item
    const food = await foodModel.findOne({
      $or: [{ foodID: menuId }, { _id: menuId }],
      sellerID: store.sellerID
    });
    
    if (!food) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Menu item not found"
      });
    }

    // Update fields
    const allowedFields = ["foodName", "description", "price", "foodImage", "category", "stock", "isAvailable"];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        food[field] = updateData[field];
      }
    });
    
    await food.save();

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Menu item updated successfully",
      food: food.toObject()
    });
    
  } catch (error) {
    console.error("updateMenuItem error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error updating menu item",
      error: error.message
    });
  }
};

/**
 * DELETE /api/seller/store/:storeId/menu/:menuId
 * Xóa món ăn khỏi menu
 */
export const deleteMenuItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { storeId, menuId } = req.params;

    // Tìm store và verify ownership - chỉ dùng _id nếu là ObjectId hợp lệ
    const storeQuery = isValidObjectId(storeId) 
      ? { $or: [{ sellerID: storeId }, { _id: storeId }] }
      : { sellerID: storeId };
    const store = await sellerModel.findOne(storeQuery);
    
    if (!store) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Store not found"
      });
    }
    
    if (store.userID.toString() !== userId.toString()) {
      return res.status(403).json({
        ok: false,
        success: false,
        message: "You don't have permission to delete from this menu"
      });
    }

    // Tìm và xóa food item
    const food = await foodModel.findOneAndDelete({
      $or: [{ foodID: menuId }, { _id: menuId }],
      sellerID: store.sellerID
    });
    
    if (!food) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Menu item not found"
      });
    }

    // Recalc store completion (sau khi xóa có thể không còn complete)
    const menuCount = await foodModel.countDocuments({ sellerID: store.sellerID });
    const { isComplete, missingFields } = checkCompleteness(store, menuCount);
    
    if (store.isComplete !== isComplete) {
      store.isComplete = isComplete;
      await store.save();
    }

    return res.status(200).json({
      ok: true,
      success: true,
      message: "Menu item deleted successfully",
      deletedFood: food.toObject(),
      storeCompleteness: { isComplete, missingFields },
      menuCount
    });
    
  } catch (error) {
    console.error("deleteMenuItem error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error deleting menu item",
      error: error.message
    });
  }
};

/**
 * GET /api/seller/store/:id/menu
 * Lấy tất cả menu items của store
 */
export const getStoreMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm store - chỉ dùng _id nếu là ObjectId hợp lệ
    const query = isValidObjectId(id) 
      ? { $or: [{ sellerID: id }, { _id: id }] }
      : { sellerID: id };
    const store = await sellerModel.findOne(query);
    
    if (!store) {
      return res.status(404).json({
        ok: false,
        success: false,
        message: "Store not found"
      });
    }

    // Lấy menu items
    const menuItems = await foodModel.find({ sellerID: store.sellerID })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      success: true,
      store: {
        sellerID: store.sellerID,
        storeName: store.storeName
      },
      menuItems,
      count: menuItems.length
    });
    
  } catch (error) {
    console.error("getStoreMenu error:", error);
    return res.status(500).json({
      ok: false,
      success: false,
      message: "Error fetching menu",
      error: error.message
    });
  }
};
