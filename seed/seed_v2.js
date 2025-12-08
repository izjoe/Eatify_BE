// seed_v2.js - 8 Categories với 80 món ăn Việt Nam
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import ratingModel from "../models/ratingModel.js";

const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error(" MONGO_URI is not defined in .env file");
  process.exit(1);
}

// Helper
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 8 CATEGORIES
const CATEGORIES = [
  "Món Việt",
  "Đồ Ăn Nhật", 
  "Đồ Ăn Âu",
  "Món Hàn",
  "Salad",
  "Tráng Miệng",
  "Đồ Uống",
  "Đồ Cuốn"
];

// 6 Restaurants
const sampleRestaurants = [
  {
    sellerID: "SELLER_001",
    userID: "USER_SELLER_001",
    storeName: "Quán Việt Thơm",
    storeAddress: "123 Nguyễn Trãi, Quận 5, TP. HCM",
    storeDescription: "Quán chuyên các món Việt quen thuộc, hương vị đậm đà chuẩn Sài Gòn.",
    storeAvatar: "restaurant-1.jpg",
    categories: ["Món Việt", "Đồ Cuốn"]
  },
  {
    sellerID: "SELLER_002",
    userID: "USER_SELLER_002", 
    storeName: "Sushi Sakura",
    storeAddress: "45 Lê Thánh Tôn, Quận 1, TP. HCM",
    storeDescription: "Ẩm thực Nhật Bản chính thống với nguyên liệu tươi sống.",
    storeAvatar: "restaurant-2.jpg",
    categories: ["Đồ Ăn Nhật"]
  },
  {
    sellerID: "SELLER_003",
    userID: "USER_SELLER_003",
    storeName: "Pizza & Pasta House", 
    storeAddress: "78 Bạch Đằng, Quận Bình Thạnh, TP. HCM",
    storeDescription: "Nhà hàng Âu với pizza, pasta và steak thượng hạng.",
    storeAvatar: "restaurant-3.jpg",
    categories: ["Đồ Ăn Âu", "Salad"]
  },
  {
    sellerID: "SELLER_004",
    userID: "USER_SELLER_004",
    storeName: "Seoul Street",
    storeAddress: "22 Trần Hưng Đạo, Quận 1, TP. HCM",
    storeDescription: "Ẩm thực đường phố Hàn Quốc chính hiệu.",
    storeAvatar: "restaurant-4.jpg",
    categories: ["Món Hàn"]
  },
  {
    sellerID: "SELLER_005",
    userID: "USER_SELLER_005",
    storeName: "Green Salad Corner",
    storeAddress: "15 Nguyễn Huệ, Quận 1, TP. HCM", 
    storeDescription: "Salad tươi ngon, healthy food cho người yêu sức khỏe.",
    storeAvatar: "restaurant-5.jpg",
    categories: ["Salad", "Đồ Uống"]
  },
  {
    sellerID: "SELLER_006",
    userID: "USER_SELLER_006",
    storeName: "Sweet Corner",
    storeAddress: "88 Hai Bà Trưng, Quận 3, TP. HCM",
    storeDescription: "Tráng miệng và đồ uống thơm ngon cho mọi dịp.",
    storeAvatar: "restaurant-6.jpg",
    categories: ["Tráng Miệng", "Đồ Uống"]
  }
];

// 80 FOODS - Chia theo 8 categories (10 món mỗi category)
const allFoods = [
  // ========== CATEGORY 1: MÓN VIỆT (10 món) ==========
  { foodName: "Phở bò tái chín", description: "Bánh phở mềm, thịt bò tái chín thái mỏng, nước dùng đậm đà ninh từ xương.", price: 45000, category: "Món Việt", foodImage: "food_1.png", averageRating: 4.8, totalRatings: 120 },
  { foodName: "Bún bò Huế", description: "Bún sợi to, nước lèo cay nhẹ, giò chả và thịt bò thơm béo đặc trưng miền Trung.", price: 50000, category: "Món Việt", foodImage: "food_2.png", averageRating: 4.7, totalRatings: 95 },
  { foodName: "Cơm tấm sườn bì chả", description: "Sườn nướng than mật ong, bì mềm, chả trứng béo ngậy ăn kèm mỡ hành.", price: 55000, category: "Món Việt", foodImage: "food_3.png", averageRating: 4.6, totalRatings: 88 },
  { foodName: "Gà rán giòn", description: "Gà rán vàng ruộm, lớp vỏ giòn rụm, thịt mềm mọng nước.", price: 65000, category: "Món Việt", foodImage: "food_4.png", averageRating: 4.8, totalRatings: 62 },
  { foodName: "Bánh mì thịt", description: "Bánh mì vỏ giòn, pate béo, thịt nguội, dưa leo và rau ngò tươi.", price: 25000, category: "Món Việt", foodImage: "food_5.png", averageRating: 4.5, totalRatings: 54 },
  { foodName: "Bún chả Hà Nội", description: "Thịt nướng thơm, nước mắm pha hài hòa, bún tươi và rau sống.", price: 48000, category: "Món Việt", foodImage: "food_6.png", averageRating: 4.7, totalRatings: 102 },
  { foodName: "Bánh xèo tôm thịt", description: "Bánh giòn, nhân tôm thịt đầy đặn, ăn kèm rau sống và nước chấm.", price: 40000, category: "Món Việt", foodImage: "food_7.png", averageRating: 4.6, totalRatings: 41 },
  { foodName: "Hủ tiếu Nam Vang", description: "Nước dùng ngọt thanh, thịt bằm, tôm và trứng cút hấp dẫn.", price: 42000, category: "Món Việt", foodImage: "food_8.png", averageRating: 4.4, totalRatings: 33 },
  { foodName: "Miến gà xé", description: "Thịt gà luộc xé mềm, nước dùng trong, hành lá thơm phức.", price: 38000, category: "Món Việt", foodImage: "food_9.png", averageRating: 4.5, totalRatings: 27 },
  { foodName: "Cháo sườn non", description: "Cháo mịn, sườn non hầm mềm, tiêu và hành lá giúp ấm bụng.", price: 35000, category: "Món Việt", foodImage: "food_10.png", averageRating: 4.7, totalRatings: 66 },

  // ========== CATEGORY 2: ĐỒ ĂN NHẬT (10 món) ==========
  { foodName: "Sushi cá hồi", description: "Cá hồi tươi béo mềm, ăn kèm cơm giấm Nhật Bản.", price: 85000, category: "Đồ Ăn Nhật", foodImage: "food_11.png", averageRating: 4.9, totalRatings: 74 },
  { foodName: "Sashimi tổng hợp", description: "Cá hồi, cá ngừ, bạch tuộc tươi ngon, phục vụ lạnh.", price: 120000, category: "Đồ Ăn Nhật", foodImage: "food_12.png", averageRating: 4.8, totalRatings: 62 },
  { foodName: "Udon bò", description: "Sợi udon dai, nước dùng nhẹ, thịt bò mềm.", price: 75000, category: "Đồ Ăn Nhật", foodImage: "food_13.png", averageRating: 4.6, totalRatings: 28 },
  { foodName: "Ramen miso", description: "Nước dùng miso béo nhẹ, mỳ vàng dai, thịt heo chashu.", price: 85000, category: "Đồ Ăn Nhật", foodImage: "food_14.png", averageRating: 4.7, totalRatings: 35 },
  { foodName: "Cơm cà ri Nhật", description: "Nước sốt cà ri đậm đà, khoai và cà rốt ninh mềm.", price: 70000, category: "Đồ Ăn Nhật", foodImage: "food_15.png", averageRating: 4.5, totalRatings: 44 },
  { foodName: "Tempura tôm", description: "Lớp bột giòn nhẹ, tôm tươi ngọt bên trong.", price: 95000, category: "Đồ Ăn Nhật", foodImage: "food_16.png", averageRating: 4.6, totalRatings: 51 },
  { foodName: "Takoyaki", description: "Bánh nhân bạch tuộc, sốt mayo và rong biển.", price: 55000, category: "Đồ Ăn Nhật", foodImage: "food_17.png", averageRating: 4.4, totalRatings: 23 },
  { foodName: "Okonomiyaki", description: "Bánh xèo Nhật, bắp cải, thịt xông khói, sốt đặc trưng.", price: 75000, category: "Đồ Ăn Nhật", foodImage: "food_18.png", averageRating: 4.5, totalRatings: 29 },
  { foodName: "Onigiri cá hồi", description: "Cơm nắm tam giác nhân cá hồi, rong biển quấn ngoài.", price: 35000, category: "Đồ Ăn Nhật", foodImage: "food_19.png", averageRating: 4.3, totalRatings: 19 },
  { foodName: "Gyoza áp chảo", description: "Vỏ giòn đáy, nhân thịt rau thơm, chấm xì dầu mè.", price: 50000, category: "Đồ Ăn Nhật", foodImage: "food_20.png", averageRating: 4.6, totalRatings: 38 },

  // ========== CATEGORY 3: ĐỒ ĂN ÂU (10 món) ==========
  { foodName: "Burger bò phô mai", description: "Bánh burger bò nướng, phô mai cheddar tan chảy.", price: 85000, category: "Đồ Ăn Âu", foodImage: "food_21.png", averageRating: 4.7, totalRatings: 83 },
  { foodName: "Mỳ Ý sốt bò bằm", description: "Sốt cà chua thơm, thịt bò bằm mềm đậm đà.", price: 75000, category: "Đồ Ăn Âu", foodImage: "food_22.png", averageRating: 4.8, totalRatings: 76 },
  { foodName: "Pizza hải sản", description: "Tôm mực tươi, sốt cà chua và phô mai mozzarella.", price: 150000, category: "Đồ Ăn Âu", foodImage: "food_23.png", averageRating: 4.5, totalRatings: 57 },
  { foodName: "Steak bò Mỹ", description: "Bò mềm mọng nước, nướng medium rare chuẩn vị.", price: 250000, category: "Đồ Ăn Âu", foodImage: "food_24.png", averageRating: 4.9, totalRatings: 92 },
  { foodName: "Salad Caesar", description: "Rau romaine giòn, sốt đặc trưng, gà nướng hoặc bacon.", price: 65000, category: "Đồ Ăn Âu", foodImage: "food_25.png", averageRating: 4.4, totalRatings: 41 },
  { foodName: "Soup bí đỏ kem tươi", description: "Soup mịn, béo nhẹ, thơm mùi bơ.", price: 45000, category: "Đồ Ăn Âu", foodImage: "food_26.png", averageRating: 4.3, totalRatings: 22 },
  { foodName: "Fish & Chips", description: "Cá phi lê giòn rụm, khoai tây chiên vàng.", price: 95000, category: "Đồ Ăn Âu", foodImage: "food_27.png", averageRating: 4.5, totalRatings: 39 },
  { foodName: "Lasagna", description: "Tầng mì Ý xen thịt sốt cà chua, phủ phô mai béo.", price: 90000, category: "Đồ Ăn Âu", foodImage: "food_28.png", averageRating: 4.7, totalRatings: 55 },
  { foodName: "Pasta Carbonara", description: "Sốt kem trứng, bacon giòn, mỳ dai.", price: 85000, category: "Đồ Ăn Âu", foodImage: "food_29.png", averageRating: 4.6, totalRatings: 48 },
  { foodName: "Sandwich gà nướng", description: "Bánh sandwich nhân gà ướp nướng và rau tươi.", price: 55000, category: "Đồ Ăn Âu", foodImage: "food_30.png", averageRating: 4.4, totalRatings: 31 },

  // ========== CATEGORY 4: MÓN HÀN (10 món) ==========
  { foodName: "Tokbokki cay", description: "Bánh gạo dẻo, sốt gochujang cay ngọt.", price: 45000, category: "Món Hàn", foodImage: "food_31.png", averageRating: 4.6, totalRatings: 64 },
  { foodName: "Gà rán Hàn Quốc", description: "Lớp vỏ giòn, phủ sốt cay hoặc ngọt.", price: 95000, category: "Món Hàn", foodImage: "food_32.png", averageRating: 4.8, totalRatings: 72 },
  { foodName: "Kimbap", description: "Cơm cuộn rong biển, nhân trứng, củ cải và thịt.", price: 40000, category: "Món Hàn", foodImage: "food_1.png", averageRating: 4.5, totalRatings: 53 },
  { foodName: "Kimchi jjigae", description: "Canh kimchi cay, thịt heo và đậu hũ.", price: 55000, category: "Món Hàn", foodImage: "food_2.png", averageRating: 4.4, totalRatings: 29 },
  { foodName: "Bibimbap", description: "Cơm trộn rau củ, trứng ốp và tương ớt Hàn.", price: 65000, category: "Món Hàn", foodImage: "food_3.png", averageRating: 4.7, totalRatings: 48 },
  { foodName: "Jajangmyeon", description: "Mì sốt đậu đen, thịt heo và hành tây.", price: 60000, category: "Món Hàn", foodImage: "food_4.png", averageRating: 4.3, totalRatings: 24 },
  { foodName: "Soondubu", description: "Đậu hũ non hầm cay, trứng và hải sản.", price: 70000, category: "Món Hàn", foodImage: "food_5.png", averageRating: 4.5, totalRatings: 28 },
  { foodName: "Mandu chiên", description: "Há cảo chiên giòn, nhân thịt rau.", price: 45000, category: "Món Hàn", foodImage: "food_6.png", averageRating: 4.4, totalRatings: 33 },
  { foodName: "Hotteok", description: "Bánh ngọt nhân đường nâu và quế.", price: 30000, category: "Món Hàn", foodImage: "food_7.png", averageRating: 4.2, totalRatings: 17 },
  { foodName: "Bulgogi", description: "Thịt bò ướp ngọt mềm, áp chảo thơm.", price: 85000, category: "Món Hàn", foodImage: "food_8.png", averageRating: 4.8, totalRatings: 59 },

  // ========== CATEGORY 5: SALAD (10 món) ==========
  { foodName: "Salad cá ngừ", description: "Salad tươi mát với cá ngừ đóng hộp và sốt mè rang.", price: 55000, category: "Salad", foodImage: "food_9.png", averageRating: 4.5, totalRatings: 20 },
  { foodName: "Salad xoài tôm", description: "Xoài xanh giòn, tôm luộc và sốt chanh dây.", price: 60000, category: "Salad", foodImage: "food_10.png", averageRating: 4.6, totalRatings: 31 },
  { foodName: "Salad bơ trứng", description: "Bơ chín mềm, trứng luộc và rau xanh tươi.", price: 50000, category: "Salad", foodImage: "food_11.png", averageRating: 4.4, totalRatings: 18 },
  { foodName: "Salad đậu gà sốt mè", description: "Đậu gà nấu mềm, rau củ và sốt mè rang.", price: 45000, category: "Salad", foodImage: "food_12.png", averageRating: 4.3, totalRatings: 14 },
  { foodName: "Salad rau củ mix", description: "Rau củ tổng hợp tươi ngon với dressing tùy chọn.", price: 40000, category: "Salad", foodImage: "food_13.png", averageRating: 4.2, totalRatings: 10 },
  { foodName: "Salad dưa lưới jambon", description: "Dưa lưới ngọt mát kết hợp jambon cao cấp.", price: 65000, category: "Salad", foodImage: "food_14.png", averageRating: 4.5, totalRatings: 22 },
  { foodName: "Salad ức gà nướng", description: "Ức gà nướng thái lát, rau xanh và sốt thousand island.", price: 70000, category: "Salad", foodImage: "food_15.png", averageRating: 4.7, totalRatings: 42 },
  { foodName: "Salad nấm trộn mè", description: "Nấm đùi gà xào, rau mầm và sốt mè rang.", price: 48000, category: "Salad", foodImage: "food_16.png", averageRating: 4.1, totalRatings: 9 },
  { foodName: "Salad thanh cua", description: "Thanh cua Nhật, bắp cải và mayonnaise.", price: 52000, category: "Salad", foodImage: "food_17.png", averageRating: 4.3, totalRatings: 16 },
  { foodName: "Salad Hy Lạp", description: "Cà chua, dưa chuột, olive đen và phô mai feta.", price: 65000, category: "Salad", foodImage: "food_18.png", averageRating: 4.6, totalRatings: 27 },

  // ========== CATEGORY 6: TRÁNG MIỆNG (10 món) ==========
  { foodName: "Bánh tiramisu", description: "Lớp kem mascarpone mịn, cà phê thấm đều, cacao phủ mặt.", price: 55000, category: "Tráng Miệng", foodImage: "food_19.png", averageRating: 4.9, totalRatings: 103 },
  { foodName: "Bánh mousse dâu", description: "Mousse dâu tây mềm mịn, trang trí dâu tươi.", price: 50000, category: "Tráng Miệng", foodImage: "food_20.png", averageRating: 4.6, totalRatings: 44 },
  { foodName: "Chè khúc bạch", description: "Khúc bạch mềm dai, nước đường trong, hạnh nhân thơm.", price: 30000, category: "Tráng Miệng", foodImage: "food_21.png", averageRating: 4.5, totalRatings: 61 },
  { foodName: "Kem vani socola", description: "Kem vani béo ngậy kết hợp socola đậm đà.", price: 35000, category: "Tráng Miệng", foodImage: "food_22.png", averageRating: 4.7, totalRatings: 52 },
  { foodName: "Pudding xoài", description: "Pudding mềm mịn vị xoài tươi mát.", price: 28000, category: "Tráng Miệng", foodImage: "food_23.png", averageRating: 4.4, totalRatings: 19 },
  { foodName: "Bánh flan caramel", description: "Flan mềm mịn, caramel đắng nhẹ thơm ngon.", price: 25000, category: "Tráng Miệng", foodImage: "food_24.png", averageRating: 4.8, totalRatings: 70 },
  { foodName: "Pancake mật ong", description: "Bánh pancake xốp mềm, mật ong và bơ.", price: 45000, category: "Tráng Miệng", foodImage: "food_25.png", averageRating: 4.5, totalRatings: 34 },
  { foodName: "Chè dừa non", description: "Dừa non mềm, nước cốt dừa béo, đá bào mát lạnh.", price: 28000, category: "Tráng Miệng", foodImage: "food_26.png", averageRating: 4.3, totalRatings: 22 },
  { foodName: "Trái cây mix", description: "Trái cây tươi theo mùa, sốt sữa chua.", price: 35000, category: "Tráng Miệng", foodImage: "food_27.png", averageRating: 4.2, totalRatings: 18 },
  { foodName: "Bánh lava chocolate", description: "Bánh chocolate nhân chảy nóng hổi, kem vani.", price: 60000, category: "Tráng Miệng", foodImage: "food_28.png", averageRating: 4.9, totalRatings: 88 },

  // ========== CATEGORY 7: ĐỒ UỐNG (10 món) ==========
  { foodName: "Trà sữa trân châu", description: "Trà đen đậm, sữa tươi, trân châu đường đen dẻo.", price: 35000, category: "Đồ Uống", foodImage: "food_29.png", averageRating: 4.8, totalRatings: 123 },
  { foodName: "Trà đào cam sả", description: "Trà đào thơm, cam tươi và sả thơm mát.", price: 32000, category: "Đồ Uống", foodImage: "food_30.png", averageRating: 4.7, totalRatings: 74 },
  { foodName: "Nước cam ép", description: "Cam tươi ép nguyên chất, không đường.", price: 28000, category: "Đồ Uống", foodImage: "food_31.png", averageRating: 4.4, totalRatings: 31 },
  { foodName: "Sinh tố bơ", description: "Bơ chín béo ngậy, sữa đặc thơm.", price: 35000, category: "Đồ Uống", foodImage: "food_32.png", averageRating: 4.6, totalRatings: 45 },
  { foodName: "Sinh tố xoài", description: "Xoài cát chu ngọt, đá xay mịn.", price: 32000, category: "Đồ Uống", foodImage: "food_1.png", averageRating: 4.5, totalRatings: 39 },
  { foodName: "Cà phê sữa đá", description: "Cà phê phin đậm đà, sữa đặc béo ngậy.", price: 25000, category: "Đồ Uống", foodImage: "food_2.png", averageRating: 4.9, totalRatings: 140 },
  { foodName: "Bạc xỉu", description: "Cà phê nhẹ, sữa đặc nhiều, thơm béo.", price: 28000, category: "Đồ Uống", foodImage: "food_3.png", averageRating: 4.8, totalRatings: 98 },
  { foodName: "Hồng trà latte", description: "Hồng trà thơm, sữa tươi béo mịn.", price: 35000, category: "Đồ Uống", foodImage: "food_4.png", averageRating: 4.6, totalRatings: 51 },
  { foodName: "Soda Việt quất", description: "Soda tươi mát, việt quất tự nhiên.", price: 30000, category: "Đồ Uống", foodImage: "food_5.png", averageRating: 4.3, totalRatings: 22 },
  { foodName: "Matcha latte", description: "Bột matcha Nhật, sữa tươi đánh bông.", price: 40000, category: "Đồ Uống", foodImage: "food_6.png", averageRating: 4.7, totalRatings: 60 },

  // ========== CATEGORY 8: ĐỒ CUỐN (10 món) ==========
  { foodName: "Gỏi cuốn tôm thịt", description: "Bánh tráng mềm, tôm thịt, rau sống và bún.", price: 35000, category: "Đồ Cuốn", foodImage: "food_7.png", averageRating: 4.7, totalRatings: 50 },
  { foodName: "Cuốn diếp cá chả giò", description: "Lá diếp cá cuốn chả giò giòn rụm.", price: 38000, category: "Đồ Cuốn", foodImage: "food_8.png", averageRating: 4.3, totalRatings: 18 },
  { foodName: "Bánh cuốn nóng", description: "Bánh cuốn mỏng mềm, nhân thịt và mộc nhĩ.", price: 35000, category: "Đồ Cuốn", foodImage: "food_9.png", averageRating: 4.6, totalRatings: 42 },
  { foodName: "Chả giò rế", description: "Chả giò vỏ rế giòn tan, nhân tôm thịt.", price: 40000, category: "Đồ Cuốn", foodImage: "food_10.png", averageRating: 4.4, totalRatings: 27 },
  { foodName: "Bánh tráng thịt heo", description: "Bánh tráng phơi sương, thịt heo luộc và rau sống.", price: 55000, category: "Đồ Cuốn", foodImage: "food_11.png", averageRating: 4.7, totalRatings: 38 },
  { foodName: "Cuốn chả cá", description: "Bánh tráng cuốn chả cá Lã Vọng thơm ngon.", price: 45000, category: "Đồ Cuốn", foodImage: "food_12.png", averageRating: 4.2, totalRatings: 15 },
  { foodName: "Bánh tráng trộn", description: "Bánh tráng xắt, trứng cút, khô bò và mắm ruốc.", price: 25000, category: "Đồ Cuốn", foodImage: "food_13.png", averageRating: 4.5, totalRatings: 61 },
  { foodName: "Há cảo hấp", description: "Há cảo mỏng, nhân tôm thịt, chấm tương ớt.", price: 40000, category: "Đồ Cuốn", foodImage: "food_14.png", averageRating: 4.4, totalRatings: 22 },
  { foodName: "Xíu mại sốt cà", description: "Xíu mại mềm, sốt cà chua đậm đà.", price: 35000, category: "Đồ Cuốn", foodImage: "food_15.png", averageRating: 4.3, totalRatings: 19 },
  { foodName: "Bánh bèo chén", description: "Bánh bèo mềm, tôm chấy và mỡ hành thơm.", price: 30000, category: "Đồ Cuốn", foodImage: "food_16.png", averageRating: 4.5, totalRatings: 35 }
];

// Assign sellers to foods by category
const categoryToSeller = {
  "Món Việt": "SELLER_001",
  "Đồ Ăn Nhật": "SELLER_002",
  "Đồ Ăn Âu": "SELLER_003",
  "Món Hàn": "SELLER_004",
  "Salad": "SELLER_005",
  "Tráng Miệng": "SELLER_006",
  "Đồ Uống": "SELLER_006",
  "Đồ Cuốn": "SELLER_001"
};

// Demo users
function generateDemoUsers(count = 20) {
  const users = [];
  const firstNames = ["Minh", "Hương", "Tuấn", "Linh", "Đức", "Ngọc", "Phong", "Thảo", "Hải", "Lan"];
  const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ"];
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[randInt(0, firstNames.length - 1)];
    const lastName = lastNames[randInt(0, lastNames.length - 1)];
    const username = `demouser${i}`;
    users.push({
      userID: `USER_DEMO_${String(i).padStart(3, '0')}`,
      userName: username,
      name: `${lastName} ${firstName}`,
      email: `${username}@eatify.com`,
      password: "$2b$10$examplehashedpasswordfortesting",
      role: "buyer",
      profileImage: `avatar-${(i % 6) + 1}.png`
    });
  }
  return users;
}

// Sample comments
const commentSamples = [
  "Ngon lắm, đáng tiền!",
  "Phục vụ nhanh, món ăn vừa miệng.",
  "Sẽ quay lại ủng hộ.",
  "Giá hơi cao nhưng chất lượng tốt.",
  "Món ăn đúng hương vị.",
  "Đóng gói cẩn thận, giao hàng nhanh.",
  "Lần đầu ăn thử, rất hài lòng.",
  "Sẽ order lại món này.",
  "Ngon nhưng hơi ít.",
  "Đồ ăn tươi, không bị nguội.",
  "Yêu thích quán này!"
];

// ---------- Seed procedure ----------
async function seed() {
  try {
    await mongoose.connect(MONGO);
    console.log(" Connected to MongoDB");

    // Clear old seed data
    console.log("️ Clearing old data...");
    await Promise.all([
      sellerModel.deleteMany({ sellerID: { $regex: /^SELLER_/ } }),
      foodModel.deleteMany({ foodID: { $regex: /^FOOD_/ } }),
      userModel.deleteMany({ userID: { $regex: /^USER_DEMO_|^USER_SELLER_/ } }),
      ratingModel.deleteMany({ ratingID: { $regex: /^RT_SEED_/ } })
    ]);

    // Create seller users first
    console.log(" Creating seller accounts...");
    for (const restaurant of sampleRestaurants) {
      const username = restaurant.sellerID.toLowerCase().replace(/_/g, '');
      await userModel.create({
        userID: restaurant.userID,
        userName: username,
        name: restaurant.storeName + " Owner",
        email: username + "@eatify.com",
        password: "$2b$10$examplehashedpasswordfortesting",
        role: "seller"
      });
    }

    // Insert restaurants
    console.log(" Inserting restaurants...");
    await sellerModel.insertMany(sampleRestaurants);
    console.log(`    Inserted ${sampleRestaurants.length} restaurants`);

    // Insert foods
    console.log("️ Inserting foods...");
    const foodDocuments = allFoods.map((food, index) => ({
      foodID: `FOOD_${String(index + 1).padStart(3, '0')}`,
      sellerID: categoryToSeller[food.category],
      foodName: food.foodName,
      description: food.description,
      price: food.price,
      foodImage: food.foodImage,
      category: food.category,
      stock: randInt(10, 50),
      isAvailable: true,
      averageRating: food.averageRating,
      totalRatings: food.totalRatings
    }));

    await foodModel.insertMany(foodDocuments);
    console.log(`    Inserted ${foodDocuments.length} foods`);

    // Create demo users
    console.log(" Creating demo users...");
    const users = generateDemoUsers(20);
    const createdUsers = await userModel.insertMany(users);
    console.log(`    Created ${createdUsers.length} users`);

    // Generate reviews
    console.log("⭐ Generating reviews...");
    const reviewsToInsert = [];
    
    for (const food of foodDocuments) {
      const numReviews = randInt(2, 6);
      const usedUsers = new Set();

      for (let k = 0; k < numReviews; k++) {
        let user;
        let attempts = 0;
        do {
          user = createdUsers[randInt(0, createdUsers.length - 1)];
          attempts++;
        } while (usedUsers.has(user.userID) && attempts < 10);
        
        if (usedUsers.has(user.userID)) continue;
        usedUsers.add(user.userID);

        const rating = randInt(3, 5);
        const comment = commentSamples[randInt(0, commentSamples.length - 1)];
        const daysAgo = randInt(0, 60);

        reviewsToInsert.push({
          ratingID: `RT_SEED_${Date.now()}_${randInt(1000, 9999)}_${reviewsToInsert.length}`,
          userID: user.userID,
          foodID: food.foodID,
          rating,
          comment,
          userName: user.name,
          userAvatar: user.profileImage,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        });
      }
    }

    await ratingModel.insertMany(reviewsToInsert);
    console.log(`    Inserted ${reviewsToInsert.length} reviews`);

    // Summary
    console.log("\n Seeding complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`    Restaurants: ${sampleRestaurants.length}`);
    console.log(`   ️  Foods: ${foodDocuments.length}`);
    console.log(`    Demo Users: ${createdUsers.length}`);
    console.log(`   ⭐ Reviews: ${reviewsToInsert.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Category breakdown
    console.log("\n Foods by Category:");
    for (const cat of CATEGORIES) {
      const count = foodDocuments.filter(f => f.category === cat).length;
      console.log(`   ${cat}: ${count} món`);
    }

  } catch (err) {
    console.error(" Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("\n Disconnected from MongoDB. Done!");
  }
}

seed();
