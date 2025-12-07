// seed_all.js - Compatible with existing Eatify models
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import ratingModel from "../models/ratingModel.js";

const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

// ---------- Sample data ----------

// 6 restaurants. Each will get 15,14,13,13,13,12 foods respectively (total = 80)
const sampleRestaurants = [
  {
    sellerID: "SELLER_VIET_001",
    userID: "USER_SELLER_VIET_001",
    storeName: "Quán Việt Thơm",
    storeDescription: "Món Việt truyền thống, nước dùng đậm đà ninh từ xương trong 24 giờ.",
    storeAddress: "12 Lê Lợi, Quận 1, TP.HCM",
    storeImage: "rest-viet.jpg",
    categories: ["Món Việt", "Đồ cuốn", "Ăn nhẹ"],
    openTime: "06:00",
    closeTime: "22:00",
    isActive: true,
    averageRating: 4.7,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_SUSHI_002",
    userID: "USER_SELLER_SUSHI_002",
    storeName: "Sushi Sakura",
    storeDescription: "Sushi và sashimi tươi ngon chuẩn Nhật, nguyên liệu nhập khẩu hàng ngày.",
    storeAddress: "88 Nguyễn Huệ, Quận 1, TP.HCM",
    storeImage: "rest-sushi.jpg",
    categories: ["Đồ Nhật", "Hải sản"],
    openTime: "10:00",
    closeTime: "22:00",
    isActive: true,
    averageRating: 4.8,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_PIZZA_003",
    userID: "USER_SELLER_PIZZA_003",
    storeName: "Pizza & Pasta House",
    storeDescription: "Pizza nướng than, pasta sốt đặc trưng Ý, steak bò Mỹ nhập khẩu.",
    storeAddress: "200 Thảo Điền, Thủ Đức, TP.HCM",
    storeImage: "rest-pizza.jpg",
    categories: ["Đồ Âu", "Pasta", "Pizza"],
    openTime: "11:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.6,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_TEA_004",
    userID: "USER_SELLER_TEA_004",
    storeName: "Trà Sữa Đồng Quê",
    storeDescription: "Trà sữa trân châu tự làm, nhiều topping đa dạng, không chất bảo quản.",
    storeAddress: "12 Phạm Văn Đồng, Gò Vấp, TP.HCM",
    storeImage: "rest-tea.jpg",
    categories: ["Đồ uống", "Tráng miệng"],
    openTime: "08:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.5,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_KOREAN_005",
    userID: "USER_SELLER_KOREAN_005",
    storeName: "Seoul Street",
    storeDescription: "Ẩm thực Hàn Quốc đường phố: tokbokki, gà rán, banchan miễn phí.",
    storeAddress: "45 Lê Văn Sỹ, Phú Nhuận, TP.HCM",
    storeImage: "rest-korean.jpg",
    categories: ["Đồ Hàn", "Món nhanh"],
    openTime: "11:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.7,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_SALAD_006",
    userID: "USER_SELLER_SALAD_006",
    storeName: "Green Salad Corner",
    storeDescription: "Salad tươi, healthy bowl và đồ ăn nhẹ cho người yêu sức khỏe.",
    storeAddress: "5 Võ Thị Sáu, Quận 3, TP.HCM",
    storeImage: "rest-salad.jpg",
    categories: ["Salad", "Ăn nhẹ"],
    openTime: "07:00",
    closeTime: "21:00",
    isActive: true,
    averageRating: 4.4,
    verificationStatus: "verified"
  }
];

// Food data per restaurant (15, 14, 13, 13, 13, 12 = 80 foods total)
const foodsByRest = [
  // Quán Việt Thơm (15 món)
  [
    { name: "Phở bò tái chín", desc: "Bánh phở mềm, thịt bò tái chín thái mỏng, nước dùng đậm đà ninh từ xương.", price: 55000, category: "Món Việt" },
    { name: "Bún bò Huế", desc: "Bún sợi to, nước lèo cay nhẹ, giò chả và thịt bò thơm béo đặc trưng miền Trung.", price: 50000, category: "Món Việt" },
    { name: "Cơm tấm sườn bì chả", desc: "Sườn nướng than mật ong, bì mềm, chả trứng béo ngậy ăn kèm mỡ hành.", price: 45000, category: "Món Việt" },
    { name: "Gà rán giòn", desc: "Gà rán vàng ruộm, lớp vỏ giòn rụm, thịt mềm mọng nước.", price: 65000, category: "Món Việt" },
    { name: "Bánh mì thịt", desc: "Bánh mì vỏ giòn, pate béo, thịt nguội, dưa leo và rau ngò tươi.", price: 25000, category: "Món Việt" },
    { name: "Bún chả Hà Nội", desc: "Thịt nướng thơm, nước mắm pha hài hòa, bún tươi và rau sống.", price: 48000, category: "Món Việt" },
    { name: "Bánh xèo tôm thịt", desc: "Bánh giòn, nhân tôm thịt đầy đặn, ăn kèm rau sống và nước chấm.", price: 40000, category: "Món Việt" },
    { name: "Hủ tiếu Nam Vang", desc: "Nước dùng ngọt thanh, thịt bằm, tôm và trứng cút hấp dẫn.", price: 45000, category: "Món Việt" },
    { name: "Miến gà xé", desc: "Thịt gà luộc xé mềm, nước dùng trong, hành lá thơm phức.", price: 42000, category: "Món Việt" },
    { name: "Cháo sườn non", desc: "Cháo mịn, sườn non hầm mềm, tiêu và hành lá giúp ấm bụng.", price: 35000, category: "Món Việt" },
    { name: "Gỏi cuốn tôm thịt", desc: "Cuốn tươi với tôm, thịt heo, bún và rau sống, chấm mắm nêm.", price: 35000, category: "Đồ cuốn" },
    { name: "Bánh cuốn nóng", desc: "Bánh mỏng mềm, nhân thịt heo và mộc nhĩ, ăn kèm chả lụa.", price: 38000, category: "Ăn nhẹ" },
    { name: "Chả giò rế", desc: "Chả giò giòn rụm, nhân thịt heo và nấm, chấm nước mắm chua ngọt.", price: 40000, category: "Ăn nhẹ" },
    { name: "Bánh bèo chén", desc: "Bánh bèo mềm mịn, tôm chấy vàng, mỡ hành và nước mắm ngọt.", price: 30000, category: "Ăn nhẹ" },
    { name: "Bánh tráng thịt heo", desc: "Bánh tráng cuốn thịt heo luộc, rau sống và mắm nêm Đà Nẵng.", price: 55000, category: "Đồ cuốn" }
  ],

  // Sushi Sakura (14 món)
  [
    { name: "Sushi cá hồi", desc: "Cá hồi tươi béo mềm, ăn kèm cơm giấm Nhật Bản.", price: 85000, category: "Đồ Nhật" },
    { name: "Sashimi tổng hợp", desc: "Cá hồi, cá ngừ, bạch tuộc tươi ngon, phục vụ lạnh.", price: 150000, category: "Đồ Nhật" },
    { name: "Udon bò", desc: "Sợi udon dai, nước dùng nhẹ, thịt bò mềm.", price: 75000, category: "Đồ Nhật" },
    { name: "Ramen miso", desc: "Nước dùng miso béo nhẹ, mỳ vàng dai, thịt heo chashu.", price: 85000, category: "Đồ Nhật" },
    { name: "Cơm cà ri Nhật", desc: "Nước sốt cà ri đậm đà, khoai và cà rốt ninh mềm.", price: 65000, category: "Đồ Nhật" },
    { name: "Tempura tôm", desc: "Lớp bột giòn nhẹ, tôm tươi ngọt bên trong.", price: 95000, category: "Đồ Nhật" },
    { name: "Takoyaki", desc: "Bánh nhân bạch tuộc, sốt mayo và rong biển.", price: 55000, category: "Đồ Nhật" },
    { name: "Okonomiyaki", desc: "Bánh xèo Nhật, bắp cải, thịt xông khói, sốt đặc trưng.", price: 75000, category: "Đồ Nhật" },
    { name: "Onigiri cá hồi", desc: "Cơm nắm tam giác nhân cá hồi, rong biển quấn ngoài.", price: 35000, category: "Đồ Nhật" },
    { name: "Gyoza áp chảo", desc: "Vỏ giòn đáy, nhân thịt rau thơm, chấm xì dầu mè.", price: 55000, category: "Đồ Nhật" },
    { name: "Sushi set A", desc: "Combo 12 miếng sushi đa dạng, cá hồi, cá ngừ, tôm.", price: 180000, category: "Hải sản" },
    { name: "Sashimi cá ngừ", desc: "Cá ngừ đại dương thái mỏng, tươi ngọt.", price: 120000, category: "Hải sản" },
    { name: "Donburi bò", desc: "Cơm thịt bò kiểu Nhật với trứng và hành.", price: 70000, category: "Đồ Nhật" },
    { name: "Miso soup", desc: "Súp đậu nành Nhật Bản với đậu hũ và rong biển.", price: 25000, category: "Đồ Nhật" }
  ],

  // Pizza & Pasta House (13 món)
  [
    { name: "Burger bò phô mai", desc: "Bánh burger bò nướng, phô mai cheddar tan chảy.", price: 85000, category: "Đồ Âu" },
    { name: "Mỳ Ý sốt bò bằm", desc: "Sốt cà chua thơm, thịt bò bằm mềm đậm đà.", price: 75000, category: "Pasta" },
    { name: "Pizza hải sản", desc: "Tôm mực tươi, sốt cà chua và phô mai mozzarella.", price: 180000, category: "Pizza" },
    { name: "Steak bò Mỹ", desc: "Bò mềm mọng nước, nướng medium rare chuẩn vị.", price: 280000, category: "Đồ Âu" },
    { name: "Salad Caesar", desc: "Rau romaine giòn, sốt đặc trưng, gà nướng hoặc bacon.", price: 65000, category: "Đồ Âu" },
    { name: "Soup bí đỏ kem tươi", desc: "Soup mịn, béo nhẹ, thơm mùi bơ.", price: 45000, category: "Đồ Âu" },
    { name: "Fish & Chips", desc: "Cá phi lê giòn rụm, khoai tây chiên vàng.", price: 95000, category: "Đồ Âu" },
    { name: "Lasagna", desc: "Tầng mì Ý xen thịt sốt cà chua, phủ phô mai béo.", price: 85000, category: "Pasta" },
    { name: "Pasta Carbonara", desc: "Sốt kem trứng, bacon giòn, mỳ dai.", price: 80000, category: "Pasta" },
    { name: "Sandwich gà nướng", desc: "Bánh sandwich nhân gà ướp nướng và rau tươi.", price: 55000, category: "Đồ Âu" },
    { name: "Risotto nấm", desc: "Cơm risotto Ý béo mịn với nấm truffle thơm lừng.", price: 95000, category: "Đồ Âu" },
    { name: "Garlic bread", desc: "Bánh mì bơ tỏi nướng giòn thơm.", price: 35000, category: "Đồ Âu" },
    { name: "Tiramisu", desc: "Bánh ngọt Ý với cà phê, kem mascarpone mịn màng.", price: 55000, category: "Tráng miệng" }
  ],

  // Trà Sữa Đồng Quê (13 món)
  [
    { name: "Trà sữa trân châu", desc: "Trà đen pha sữa tươi, trân châu đường đen dẻo dai.", price: 35000, category: "Đồ uống" },
    { name: "Trà đào cam sả", desc: "Trà xanh thanh mát với đào, cam và sả tươi.", price: 32000, category: "Đồ uống" },
    { name: "Nước cam ép", desc: "Cam vắt tươi 100%, không đường, giàu vitamin C.", price: 28000, category: "Đồ uống" },
    { name: "Sinh tố bơ", desc: "Bơ sáp béo ngậy xay nhuyễn với sữa đặc.", price: 35000, category: "Đồ uống" },
    { name: "Sinh tố xoài", desc: "Xoài chín ngọt xay mịn, thơm mát mùa hè.", price: 32000, category: "Đồ uống" },
    { name: "Cà phê sữa đá", desc: "Cà phê phin Việt Nam đậm đà với sữa đặc.", price: 25000, category: "Đồ uống" },
    { name: "Bạc xỉu", desc: "Cà phê nhẹ với nhiều sữa tươi, vị ngọt dịu.", price: 28000, category: "Đồ uống" },
    { name: "Hồng trà latte", desc: "Hồng trà Ceylon kết hợp sữa tươi béo mịn.", price: 38000, category: "Đồ uống" },
    { name: "Soda Việt quất", desc: "Soda tươi mát với syrup việt quất tự nhiên.", price: 30000, category: "Đồ uống" },
    { name: "Matcha latte", desc: "Trà xanh matcha Nhật Bản với sữa tươi béo.", price: 42000, category: "Đồ uống" },
    { name: "Pudding trân châu", desc: "Pudding mềm mịn với trân châu đường đen.", price: 28000, category: "Tráng miệng" },
    { name: "Bánh crepe", desc: "Bánh crepe Pháp mỏng mềm với kem tươi và trái cây.", price: 45000, category: "Tráng miệng" },
    { name: "Kem trà sữa", desc: "Kem tươi vị trà sữa độc đáo, thơm béo.", price: 35000, category: "Tráng miệng" }
  ],

  // Seoul Street (13 món)
  [
    { name: "Tokbokki cay", desc: "Bánh gạo dẻo, sốt gochujang cay ngọt.", price: 45000, category: "Đồ Hàn" },
    { name: "Gà rán Hàn Quốc", desc: "Lớp vỏ giòn, phủ sốt cay hoặc ngọt.", price: 95000, category: "Đồ Hàn" },
    { name: "Kimbap", desc: "Cơm cuộn rong biển, nhân trứng, củ cải và thịt.", price: 35000, category: "Đồ Hàn" },
    { name: "Kimchi jjigae", desc: "Canh kimchi cay, thịt heo và đậu hũ.", price: 55000, category: "Đồ Hàn" },
    { name: "Bibimbap", desc: "Cơm trộn rau củ, trứng ốp và tương ớt Hàn.", price: 65000, category: "Đồ Hàn" },
    { name: "Jajangmyeon", desc: "Mì sốt đậu đen, thịt heo và hành tây.", price: 55000, category: "Đồ Hàn" },
    { name: "Soondubu", desc: "Đậu hũ non hầm cay, trứng và hải sản.", price: 60000, category: "Đồ Hàn" },
    { name: "Mandu chiên", desc: "Há cảo chiên giòn, nhân thịt rau.", price: 45000, category: "Món nhanh" },
    { name: "Hotteok", desc: "Bánh ngọt nhân đường nâu và quế.", price: 25000, category: "Tráng miệng" },
    { name: "Bulgogi", desc: "Thịt bò ướp ngọt mềm, áp chảo thơm.", price: 85000, category: "Đồ Hàn" },
    { name: "Korean BBQ wrap", desc: "Thịt nướng cuốn rau xà lách với ssamjang.", price: 75000, category: "Món nhanh" },
    { name: "Spam musubi", desc: "Cơm nắm với thịt hộp Spam nướng kiểu Hawaii-Hàn.", price: 30000, category: "Món nhanh" },
    { name: "Korean corn dog", desc: "Xúc xích phô mai chiên giòn phủ đường và sốt.", price: 40000, category: "Món nhanh" }
  ],

  // Green Salad Corner (12 món)
  [
    { name: "Salad cá ngừ", desc: "Cá ngừ đóng hộp với rau xà lách, cà chua và sốt mayo.", price: 55000, category: "Salad" },
    { name: "Salad xoài tôm", desc: "Xoài xanh giòn, tôm luộc, rau thơm và nước mắm chua ngọt.", price: 60000, category: "Salad" },
    { name: "Salad bơ trứng", desc: "Bơ chín, trứng luộc, rau xà lách và sốt ranch.", price: 55000, category: "Salad" },
    { name: "Salad đậu gà sốt mè", desc: "Đậu gà, rau củ và sốt mè Nhật thơm béo.", price: 50000, category: "Salad" },
    { name: "Salad rau củ mix", desc: "Rau xà lách, cà rốt, dưa leo, cà chua với sốt dầu giấm.", price: 40000, category: "Salad" },
    { name: "Salad dưa lưới jambon", desc: "Dưa lưới ngọt mát, jambon và phô mai feta.", price: 65000, category: "Salad" },
    { name: "Salad ức gà nướng", desc: "Ức gà nướng thái lát, rau romaine và sốt Caesar.", price: 70000, category: "Salad" },
    { name: "Salad nấm trộn mè", desc: "Nấm hỗn hợp xào với sốt mè và rau xà lách.", price: 55000, category: "Salad" },
    { name: "Salad thanh cua", desc: "Thanh cua, bơ, rau xà lách và sốt Thousand Island.", price: 60000, category: "Salad" },
    { name: "Salad Hy Lạp", desc: "Cà chua, dưa leo, olive, phô mai feta và sốt lemon.", price: 65000, category: "Salad" },
    { name: "Smoothie dâu", desc: "Sinh tố dâu tây tươi với sữa chua Hy Lạp.", price: 45000, category: "Đồ uống" },
    { name: "Trái cây mix", desc: "Đĩa trái cây tươi theo mùa, thanh mát bổ dưỡng.", price: 50000, category: "Ăn nhẹ" }
  ]
];

// ---------- Helper utilities ----------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create demo users
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
      password: "$2b$10$examplehashedpasswordfortesting", // Dummy hash
      role: "buyer",
      profileImage: `avatar-${(i % 6) + 1}.png`
    });
  }
  return users;
}

// Sample comments for reviews
const commentSamples = [
  "Ngon lắm, đáng tiền!",
  "Phục vụ nhanh, món ăn vừa miệng.",
  "Trà sữa ngon, trân châu dẻo.",
  "Hơi mặn một chút nhưng vẫn ngon.",
  "Sẽ quay lại lần sau.",
  "Phục vụ tốt, đồ ăn nóng hổi.",
  "Quá tuyệt vời, giới thiệu bạn bè ngay!",
  "Giá hơi cao nhưng chất lượng tốt.",
  "Món ăn đúng hương vị Việt Nam.",
  "Đóng gói cẩn thận, giao hàng nhanh.",
  "Lần đầu ăn thử, rất hài lòng.",
  "Sẽ order lại món này.",
  "Ngon nhưng hơi ít.",
  "Đồ ăn tươi, không bị nguội.",
  "Yêu thích quán này!"
];

// ---------- Seed procedure ----------
async function seed({ withReviews = true } = {}) {
  try {
    await mongoose.connect(MONGO);
    console.log("✅ Connected to MongoDB:", MONGO);

    // Clear existing data
    console.log("🗑️ Clearing old data...");
    await Promise.all([
      sellerModel.deleteMany({ sellerID: { $regex: /^SELLER_/ } }),
      foodModel.deleteMany({ foodID: { $regex: /^FOOD_/ } }),
      userModel.deleteMany({ userID: { $regex: /^USER_DEMO_/ } }),
      ratingModel.deleteMany({ ratingID: { $regex: /^RT_SEED_/ } })
    ]);

    // Create seller users first
    console.log("👤 Creating seller users...");
    for (const restaurant of sampleRestaurants) {
      const existingUser = await userModel.findOne({ userID: restaurant.userID });
      if (!existingUser) {
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
    }

    // Insert restaurants (sellers)
    console.log("🏪 Inserting restaurants...");
    const createdRestaurants = await sellerModel.insertMany(sampleRestaurants);
    console.log(`   ✅ Inserted ${createdRestaurants.length} restaurants`);

    // Insert foods for each restaurant
    console.log("🍽️ Inserting foods...");
    let totalFoods = 0;
    const allFoodDocs = [];

    for (let r = 0; r < sampleRestaurants.length; r++) {
      const restaurant = sampleRestaurants[r];
      const foods = foodsByRest[r];
      
      const foodDocuments = foods.map((food, idx) => ({
        foodID: `FOOD_${restaurant.sellerID}_${String(idx + 1).padStart(3, '0')}`,
        sellerID: restaurant.sellerID,
        foodName: food.name,
        description: food.desc,
        price: food.price,
        category: food.category,
        foodImage: `food-${r + 1}-${idx + 1}.jpg`,
        stock: randInt(10, 50),
        isAvailable: true,
        averageRating: 0,
        totalRatings: 0
      }));

      await foodModel.insertMany(foodDocuments);
      allFoodDocs.push(...foodDocuments);
      totalFoods += foodDocuments.length;
      console.log(`   ✅ ${restaurant.storeName}: ${foodDocuments.length} foods`);
    }

    // Create demo users
    console.log("👥 Creating demo users...");
    const users = generateDemoUsers(20);
    const createdUsers = await userModel.insertMany(users);
    console.log(`   ✅ Created ${createdUsers.length} users`);

    // Generate reviews
    let totalReviews = 0;
    if (withReviews) {
      console.log("⭐ Generating reviews...");
      const allFoods = await foodModel.find({ foodID: { $regex: /^FOOD_/ } });
      const reviewsToInsert = [];

      // Each food gets 0-8 reviews (random)
      for (const food of allFoods) {
        const numReviews = randInt(0, 8);
        const usedUsers = new Set(); // Prevent same user reviewing same food twice

        for (let k = 0; k < numReviews; k++) {
          let user;
          let attempts = 0;
          do {
            user = createdUsers[randInt(0, createdUsers.length - 1)];
            attempts++;
          } while (usedUsers.has(user.userID) && attempts < 10);
          
          if (usedUsers.has(user.userID)) continue;
          usedUsers.add(user.userID);

          const rating = randInt(3, 5); // Prefer 3-5 stars for realistic data
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

      if (reviewsToInsert.length) {
        await ratingModel.insertMany(reviewsToInsert);
        totalReviews = reviewsToInsert.length;
        console.log(`   ✅ Inserted ${totalReviews} reviews`);
      }

      // Recalculate rating averages for each food
      console.log("📊 Updating food rating averages...");
      for (const food of allFoods) {
        const agg = await ratingModel.aggregate([
          { $match: { foodID: food.foodID } },
          { $group: { _id: "$foodID", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
        ]);

        if (agg[0]) {
          await foodModel.updateOne(
            { foodID: food.foodID },
            { 
              averageRating: Math.round(agg[0].avg * 10) / 10,
              totalRatings: agg[0].count
            }
          );
        }
      }
      console.log("   ✅ Food ratings updated");
    }

    // Summary
    console.log("\n🎉 Seeding complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   📍 Restaurants: ${createdRestaurants.length}`);
    console.log(`   🍽️  Foods: ${totalFoods}`);
    console.log(`   👥 Demo Users: ${createdUsers.length}`);
    console.log(`   ⭐ Reviews: ${totalReviews}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB. Done!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run seed
const withReviews = !process.argv.includes("--no-reviews");
seed({ withReviews });
