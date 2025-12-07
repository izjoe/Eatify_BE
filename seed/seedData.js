import mongoose from "mongoose";
import dotenv from "dotenv";
import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";

dotenv.config();

// ============= RESTAURANT DATA (5 restaurants) =============
const restaurants = [
  {
    sellerID: "SELLER_001",
    userID: "USER_SELLER_001",
    storeName: "Quán Phở Gia Truyền",
    storeDescription: "Phở Việt Nam truyền thống từ năm 1990. Nước dùng ninh từ xương bò trong 24 giờ, bánh phở tươi mỗi ngày.",
    storeAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    storeImage: "pho_restaurant.jpg",
    categories: ["Món Việt", "Phở", "Bún"],
    openTime: "06:00",
    closeTime: "22:00",
    isActive: true,
    averageRating: 4.7,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_002",
    userID: "USER_SELLER_002",
    storeName: "Sushi Tokyo",
    storeDescription: "Nhà hàng Nhật Bản chính thống với đầu bếp người Nhật. Nguyên liệu tươi sống nhập khẩu hàng ngày.",
    storeAddress: "456 Lê Lợi, Quận 3, TP.HCM",
    storeImage: "sushi_restaurant.jpg",
    categories: ["Đồ ăn Nhật", "Sushi", "Ramen"],
    openTime: "10:00",
    closeTime: "22:00",
    isActive: true,
    averageRating: 4.8,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_003",
    userID: "USER_SELLER_003",
    storeName: "Pizza & Steak House",
    storeDescription: "Nhà hàng Âu phong cách hiện đại. Steak bò Mỹ nhập khẩu, pizza lò than đá truyền thống.",
    storeAddress: "789 Đồng Khởi, Quận 1, TP.HCM",
    storeImage: "western_restaurant.jpg",
    categories: ["Đồ ăn Âu", "Pizza", "Steak"],
    openTime: "11:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.6,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_004",
    userID: "USER_SELLER_004",
    storeName: "Korean BBQ House",
    storeDescription: "Thịt nướng Hàn Quốc chính hiệu. Banchan miễn phí, không gian ấm cúng, phục vụ tận tình.",
    storeAddress: "321 Hai Bà Trưng, Quận 1, TP.HCM",
    storeImage: "korean_restaurant.jpg",
    categories: ["Món Hàn", "BBQ", "Tokbokki"],
    openTime: "11:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.7,
    verificationStatus: "verified"
  },
  {
    sellerID: "SELLER_005",
    userID: "USER_SELLER_005",
    storeName: "Trà Sữa & Dessert",
    storeDescription: "Chuyên trà sữa, đồ uống và tráng miệng. Nguyên liệu tự nhiên, không chất bảo quản.",
    storeAddress: "555 Nguyễn Trãi, Quận 5, TP.HCM",
    storeImage: "dessert_restaurant.jpg",
    categories: ["Đồ uống", "Tráng miệng", "Trà sữa"],
    openTime: "08:00",
    closeTime: "23:00",
    isActive: true,
    averageRating: 4.5,
    verificationStatus: "verified"
  }
];

// ============= FOOD DATA (18 foods per restaurant = 90 foods total) =============
const foodsByRestaurant = {
  SELLER_001: [
    // Món Việt - 18 món
    { foodName: "Phở bò tái chín", description: "Bánh phở mềm, thịt bò tái chín thái mỏng, nước dùng đậm đà ninh từ xương.", price: 55000, category: "Món Việt", averageRating: 4.8, totalRatings: 120 },
    { foodName: "Bún bò Huế", description: "Bún sợi to, nước lèo cay nhẹ, giò chả và thịt bò thơm béo đặc trưng miền Trung.", price: 50000, category: "Món Việt", averageRating: 4.7, totalRatings: 95 },
    { foodName: "Cơm tấm sườn bì chả", description: "Sườn nướng than mật ong, bì mềm, chả trứng béo ngậy ăn kèm mỡ hành.", price: 45000, category: "Món Việt", averageRating: 4.6, totalRatings: 88 },
    { foodName: "Gà rán giòn", description: "Gà rán vàng ruộm, lớp vỏ giòn rụm, thịt mềm mọng nước.", price: 65000, category: "Món Việt", averageRating: 4.8, totalRatings: 62 },
    { foodName: "Bánh mì thịt", description: "Bánh mì vỏ giòn, pate béo, thịt nguội, dưa leo và rau ngò tươi.", price: 25000, category: "Món Việt", averageRating: 4.5, totalRatings: 54 },
    { foodName: "Bún chả Hà Nội", description: "Thịt nướng thơm, nước mắm pha hài hòa, bún tươi và rau sống.", price: 48000, category: "Món Việt", averageRating: 4.7, totalRatings: 102 },
    { foodName: "Bánh xèo tôm thịt", description: "Bánh giòn, nhân tôm thịt đầy đặn, ăn kèm rau sống và nước chấm.", price: 40000, category: "Món Việt", averageRating: 4.6, totalRatings: 41 },
    { foodName: "Hủ tiếu Nam Vang", description: "Nước dùng ngọt thanh, thịt bằm, tôm và trứng cút hấp dẫn.", price: 45000, category: "Món Việt", averageRating: 4.4, totalRatings: 33 },
    { foodName: "Miến gà xé", description: "Thịt gà luộc xé mềm, nước dùng trong, hành lá thơm phức.", price: 42000, category: "Món Việt", averageRating: 4.5, totalRatings: 27 },
    { foodName: "Cháo sườn non", description: "Cháo mịn, sườn non hầm mềm, tiêu và hành lá giúp ấm bụng.", price: 35000, category: "Món Việt", averageRating: 4.7, totalRatings: 66 },
    { foodName: "Gỏi cuốn tôm thịt", description: "Cuốn tươi với tôm, thịt heo, bún và rau sống, chấm mắm nêm.", price: 35000, category: "Đồ cuốn", averageRating: 4.7, totalRatings: 50 },
    { foodName: "Bánh cuốn nóng", description: "Bánh mỏng mềm, nhân thịt heo và mộc nhĩ, ăn kèm chả lụa.", price: 38000, category: "Đồ cuốn", averageRating: 4.6, totalRatings: 42 },
    { foodName: "Chả giò rế", description: "Chả giò giòn rụm, nhân thịt heo và nấm, chấm nước mắm chua ngọt.", price: 40000, category: "Đồ cuốn", averageRating: 4.4, totalRatings: 27 },
    { foodName: "Bánh tráng thịt heo", description: "Bánh tráng cuốn thịt heo luộc, rau sống và mắm nêm Đà Nẵng.", price: 55000, category: "Đồ cuốn", averageRating: 4.7, totalRatings: 38 },
    { foodName: "Bánh tráng trộn", description: "Bánh tráng trộn với trứng cút, khô bò, rau răm và đậu phộng.", price: 25000, category: "Đồ cuốn", averageRating: 4.5, totalRatings: 61 },
    { foodName: "Xíu mại sốt cà", description: "Xíu mại thịt heo hấp chín mềm, sốt cà chua đậm đà.", price: 35000, category: "Đồ cuốn", averageRating: 4.3, totalRatings: 19 },
    { foodName: "Há cảo hấp", description: "Vỏ mỏng trong suốt, nhân tôm thịt đầy đặn, chấm xì dầu gừng.", price: 45000, category: "Đồ cuốn", averageRating: 4.4, totalRatings: 22 },
    { foodName: "Bánh bèo chén", description: "Bánh bèo mềm mịn, tôm chấy vàng, mỡ hành và nước mắm ngọt.", price: 30000, category: "Đồ cuốn", averageRating: 4.5, totalRatings: 35 }
  ],
  SELLER_002: [
    // Đồ ăn Nhật - 18 món
    { foodName: "Sushi cá hồi", description: "Cá hồi tươi béo mềm, ăn kèm cơm giấm Nhật Bản.", price: 85000, category: "Đồ ăn Nhật", averageRating: 4.9, totalRatings: 74 },
    { foodName: "Sashimi tổng hợp", description: "Cá hồi, cá ngừ, bạch tuộc tươi ngon, phục vụ lạnh.", price: 150000, category: "Đồ ăn Nhật", averageRating: 4.8, totalRatings: 62 },
    { foodName: "Udon bò", description: "Sợi udon dai, nước dùng nhẹ, thịt bò mềm.", price: 75000, category: "Đồ ăn Nhật", averageRating: 4.6, totalRatings: 28 },
    { foodName: "Ramen miso", description: "Nước dùng miso béo nhẹ, mỳ vàng dai, thịt heo chashu.", price: 85000, category: "Đồ ăn Nhật", averageRating: 4.7, totalRatings: 35 },
    { foodName: "Cơm cà ri Nhật", description: "Nước sốt cà ri đậm đà, khoai và cà rốt ninh mềm.", price: 65000, category: "Đồ ăn Nhật", averageRating: 4.5, totalRatings: 44 },
    { foodName: "Tempura tôm", description: "Lớp bột giòn nhẹ, tôm tươi ngọt bên trong.", price: 95000, category: "Đồ ăn Nhật", averageRating: 4.6, totalRatings: 51 },
    { foodName: "Takoyaki", description: "Bánh nhân bạch tuộc, sốt mayo và rong biển.", price: 55000, category: "Đồ ăn Nhật", averageRating: 4.4, totalRatings: 23 },
    { foodName: "Okonomiyaki", description: "Bánh xèo Nhật, bắp cải, thịt xông khói, sốt đặc trưng.", price: 75000, category: "Đồ ăn Nhật", averageRating: 4.5, totalRatings: 29 },
    { foodName: "Onigiri cá hồi", description: "Cơm nắm tam giác nhân cá hồi, rong biển quấn ngoài.", price: 35000, category: "Đồ ăn Nhật", averageRating: 4.3, totalRatings: 19 },
    { foodName: "Gyoza áp chảo", description: "Vỏ giòn đáy, nhân thịt rau thơm, chấm xì dầu mè.", price: 55000, category: "Đồ ăn Nhật", averageRating: 4.6, totalRatings: 38 },
    { foodName: "Katsu curry", description: "Thịt heo chiên xù giòn rụm, sốt cà ri đặc biệt.", price: 85000, category: "Đồ ăn Nhật", averageRating: 4.7, totalRatings: 45 },
    { foodName: "Tonkatsu", description: "Thịt heo chiên xù kiểu Nhật, ăn kèm bắp cải và sốt.", price: 80000, category: "Đồ ăn Nhật", averageRating: 4.5, totalRatings: 32 },
    { foodName: "Sushi lươn", description: "Lươn nướng tẩm sốt kabayaki ngọt thơm trên cơm giấm.", price: 90000, category: "Đồ ăn Nhật", averageRating: 4.8, totalRatings: 55 },
    { foodName: "Maki cuộn", description: "Cuộn sushi với cá hồi, bơ và dưa leo.", price: 65000, category: "Đồ ăn Nhật", averageRating: 4.4, totalRatings: 28 },
    { foodName: "Cơm bò teriyaki", description: "Thịt bò thái mỏng áp chảo sốt teriyaki ngọt mặn.", price: 75000, category: "Đồ ăn Nhật", averageRating: 4.6, totalRatings: 41 },
    { foodName: "Edamame", description: "Đậu nành Nhật luộc chín, rắc muối biển.", price: 35000, category: "Đồ ăn Nhật", averageRating: 4.2, totalRatings: 15 },
    { foodName: "Mì soba lạnh", description: "Mì kiều mạch lạnh, chấm nước tương dashi.", price: 60000, category: "Đồ ăn Nhật", averageRating: 4.3, totalRatings: 20 },
    { foodName: "Oyakodon", description: "Cơm trứng gà hầm với hành tây và nước dùng dashi.", price: 65000, category: "Đồ ăn Nhật", averageRating: 4.5, totalRatings: 33 }
  ],
  SELLER_003: [
    // Đồ ăn Âu - 18 món
    { foodName: "Burger bò phô mai", description: "Bánh burger bò nướng, phô mai cheddar tan chảy.", price: 85000, category: "Đồ ăn Âu", averageRating: 4.7, totalRatings: 83 },
    { foodName: "Mỳ Ý sốt bò bằm", description: "Sốt cà chua thơm, thịt bò bằm mềm đậm đà.", price: 75000, category: "Đồ ăn Âu", averageRating: 4.8, totalRatings: 76 },
    { foodName: "Pizza hải sản", description: "Tôm mực tươi, sốt cà chua và phô mai mozzarella.", price: 180000, category: "Đồ ăn Âu", averageRating: 4.5, totalRatings: 57 },
    { foodName: "Steak bò Mỹ", description: "Bò mềm mọng nước, nướng medium rare chuẩn vị.", price: 280000, category: "Đồ ăn Âu", averageRating: 4.9, totalRatings: 92 },
    { foodName: "Salad Caesar", description: "Rau romaine giòn, sốt đặc trưng, gà nướng hoặc bacon.", price: 65000, category: "Salad", averageRating: 4.4, totalRatings: 41 },
    { foodName: "Soup bí đỏ kem tươi", description: "Soup mịn, béo nhẹ, thơm mùi bơ.", price: 45000, category: "Đồ ăn Âu", averageRating: 4.3, totalRatings: 22 },
    { foodName: "Fish & Chips", description: "Cá phi lê giòn rụm, khoai tây chiên vàng.", price: 95000, category: "Đồ ăn Âu", averageRating: 4.5, totalRatings: 39 },
    { foodName: "Lasagna", description: "Tầng mì Ý xen thịt sốt cà chua, phủ phô mai béo.", price: 85000, category: "Đồ ăn Âu", averageRating: 4.7, totalRatings: 55 },
    { foodName: "Pasta Carbonara", description: "Sốt kem trứng, bacon giòn, mỳ dai.", price: 80000, category: "Đồ ăn Âu", averageRating: 4.6, totalRatings: 48 },
    { foodName: "Sandwich gà nướng", description: "Bánh sandwich nhân gà ướp nướng và rau tươi.", price: 55000, category: "Đồ ăn Âu", averageRating: 4.4, totalRatings: 31 },
    { foodName: "Pizza Margherita", description: "Pizza truyền thống Ý với cà chua, phô mai mozzarella và húng quế.", price: 150000, category: "Đồ ăn Âu", averageRating: 4.6, totalRatings: 62 },
    { foodName: "Spaghetti Aglio e Olio", description: "Mì spaghetti xào tỏi, ớt và dầu ô liu.", price: 70000, category: "Đồ ăn Âu", averageRating: 4.5, totalRatings: 35 },
    { foodName: "Gnocchi sốt kem", description: "Bánh gnocchi khoai tây mềm với sốt kem béo ngậy.", price: 85000, category: "Đồ ăn Âu", averageRating: 4.4, totalRatings: 28 },
    { foodName: "Risotto nấm truffle", description: "Cơm risotto Ý béo mịn với nấm truffle thơm lừng.", price: 120000, category: "Đồ ăn Âu", averageRating: 4.7, totalRatings: 42 },
    { foodName: "Chicken Cordon Bleu", description: "Gà cuốn jambon phô mai chiên giòn.", price: 95000, category: "Đồ ăn Âu", averageRating: 4.6, totalRatings: 37 },
    { foodName: "Beef Wellington", description: "Thăn bò bọc pate nấm trong vỏ bánh ngàn lớp.", price: 320000, category: "Đồ ăn Âu", averageRating: 4.9, totalRatings: 48 },
    { foodName: "French Onion Soup", description: "Soup hành tây caramel, phô mai gruyère nướng mặt.", price: 55000, category: "Đồ ăn Âu", averageRating: 4.3, totalRatings: 25 },
    { foodName: "Club Sandwich", description: "Sandwich 3 tầng với gà, bacon, trứng và rau tươi.", price: 65000, category: "Đồ ăn Âu", averageRating: 4.5, totalRatings: 44 }
  ],
  SELLER_004: [
    // Món Hàn - 18 món
    { foodName: "Tokbokki cay", description: "Bánh gạo dẻo, sốt gochujang cay ngọt.", price: 45000, category: "Món Hàn", averageRating: 4.6, totalRatings: 64 },
    { foodName: "Gà rán Hàn Quốc", description: "Lớp vỏ giòn, phủ sốt cay hoặc ngọt.", price: 95000, category: "Món Hàn", averageRating: 4.8, totalRatings: 72 },
    { foodName: "Kimbap", description: "Cơm cuộn rong biển, nhân trứng, củ cải và thịt.", price: 35000, category: "Món Hàn", averageRating: 4.5, totalRatings: 53 },
    { foodName: "Kimchi jjigae", description: "Canh kimchi cay, thịt heo và đậu hũ.", price: 55000, category: "Món Hàn", averageRating: 4.4, totalRatings: 29 },
    { foodName: "Bibimbap", description: "Cơm trộn rau củ, trứng ốp và tương ớt Hàn.", price: 65000, category: "Món Hàn", averageRating: 4.7, totalRatings: 48 },
    { foodName: "Jajangmyeon", description: "Mì sốt đậu đen, thịt heo và hành tây.", price: 55000, category: "Món Hàn", averageRating: 4.3, totalRatings: 24 },
    { foodName: "Soondubu", description: "Đậu hũ non hầm cay, trứng và hải sản.", price: 60000, category: "Món Hàn", averageRating: 4.5, totalRatings: 28 },
    { foodName: "Mandu chiên", description: "Há cảo chiên giòn, nhân thịt rau.", price: 45000, category: "Món Hàn", averageRating: 4.4, totalRatings: 33 },
    { foodName: "Hotteok", description: "Bánh ngọt nhân đường nâu và quế.", price: 25000, category: "Món Hàn", averageRating: 4.2, totalRatings: 17 },
    { foodName: "Bulgogi", description: "Thịt bò ướp ngọt mềm, áp chảo thơm.", price: 85000, category: "Món Hàn", averageRating: 4.8, totalRatings: 59 },
    { foodName: "Samgyeopsal", description: "Ba chỉ heo nướng tại bàn, ăn kèm rau cuốn và ssamjang.", price: 150000, category: "Món Hàn", averageRating: 4.9, totalRatings: 85 },
    { foodName: "Japchae", description: "Miến xào rau củ và thịt bò, vị ngọt nhẹ.", price: 55000, category: "Món Hàn", averageRating: 4.5, totalRatings: 38 },
    { foodName: "Sundubu jjigae hải sản", description: "Đậu hũ non hầm với tôm, nghêu và mực.", price: 75000, category: "Món Hàn", averageRating: 4.6, totalRatings: 42 },
    { foodName: "Dakgangjeong", description: "Gà chiên giòn tẩm sốt cay ngọt Hàn Quốc.", price: 85000, category: "Món Hàn", averageRating: 4.7, totalRatings: 55 },
    { foodName: "Kongnamul gukbap", description: "Canh giá đỗ Hàn Quốc với cơm nóng.", price: 45000, category: "Món Hàn", averageRating: 4.3, totalRatings: 21 },
    { foodName: "Bingsu dâu", description: "Đá bào Hàn Quốc với dâu tây và sữa đặc.", price: 65000, category: "Tráng miệng", averageRating: 4.6, totalRatings: 48 },
    { foodName: "Odeng", description: "Chả cá Hàn Quốc xiên que, nước dùng nóng.", price: 35000, category: "Món Hàn", averageRating: 4.2, totalRatings: 19 },
    { foodName: "Rabokki", description: "Tokbokki kết hợp mì ramyeon cay ngọt.", price: 55000, category: "Món Hàn", averageRating: 4.5, totalRatings: 44 }
  ],
  SELLER_005: [
    // Đồ uống & Tráng miệng - 18 món
    { foodName: "Trà sữa trân châu", description: "Trà đen pha sữa tươi, trân châu đường đen dẻo dai.", price: 35000, category: "Đồ uống", averageRating: 4.8, totalRatings: 123 },
    { foodName: "Trà đào cam sả", description: "Trà xanh thanh mát với đào, cam và sả tươi.", price: 32000, category: "Đồ uống", averageRating: 4.7, totalRatings: 74 },
    { foodName: "Nước cam ép", description: "Cam vắt tươi 100%, không đường, giàu vitamin C.", price: 28000, category: "Đồ uống", averageRating: 4.4, totalRatings: 31 },
    { foodName: "Sinh tố bơ", description: "Bơ sáp béo ngậy xay nhuyễn với sữa đặc.", price: 35000, category: "Đồ uống", averageRating: 4.6, totalRatings: 45 },
    { foodName: "Sinh tố xoài", description: "Xoài chín ngọt xay mịn, thơm mát mùa hè.", price: 32000, category: "Đồ uống", averageRating: 4.5, totalRatings: 39 },
    { foodName: "Cà phê sữa đá", description: "Cà phê phin Việt Nam đậm đà với sữa đặc.", price: 25000, category: "Đồ uống", averageRating: 4.9, totalRatings: 140 },
    { foodName: "Bạc xỉu", description: "Cà phê nhẹ với nhiều sữa tươi, vị ngọt dịu.", price: 28000, category: "Đồ uống", averageRating: 4.8, totalRatings: 98 },
    { foodName: "Hồng trà latte", description: "Hồng trà Ceylon kết hợp sữa tươi béo mịn.", price: 38000, category: "Đồ uống", averageRating: 4.6, totalRatings: 51 },
    { foodName: "Soda Việt quất", description: "Soda tươi mát với syrup việt quất tự nhiên.", price: 30000, category: "Đồ uống", averageRating: 4.3, totalRatings: 22 },
    { foodName: "Matcha latte", description: "Trà xanh matcha Nhật Bản với sữa tươi béo.", price: 42000, category: "Đồ uống", averageRating: 4.7, totalRatings: 60 },
    { foodName: "Bánh tiramisu", description: "Bánh ngọt Ý với cà phê, kem mascarpone mịn màng.", price: 55000, category: "Tráng miệng", averageRating: 4.9, totalRatings: 103 },
    { foodName: "Bánh mousse dâu", description: "Mousse dâu tây mềm mịn, lớp chocolate bao ngoài.", price: 48000, category: "Tráng miệng", averageRating: 4.6, totalRatings: 44 },
    { foodName: "Chè khúc bạch", description: "Chè nước cốt dừa với khúc bạch mềm và nhãn.", price: 28000, category: "Tráng miệng", averageRating: 4.5, totalRatings: 61 },
    { foodName: "Kem vani socola", description: "Kem tươi vị vani và socola Bỉ đậm đà.", price: 35000, category: "Tráng miệng", averageRating: 4.7, totalRatings: 52 },
    { foodName: "Pudding xoài", description: "Pudding mềm mịn với xoài chín thơm ngọt.", price: 32000, category: "Tráng miệng", averageRating: 4.4, totalRatings: 19 },
    { foodName: "Bánh flan caramel", description: "Bánh flan mềm mịn, caramel đắng nhẹ hài hòa.", price: 25000, category: "Tráng miệng", averageRating: 4.8, totalRatings: 70 },
    { foodName: "Pancake mật ong", description: "Bánh pancake xốp mềm, rưới mật ong và bơ.", price: 45000, category: "Tráng miệng", averageRating: 4.5, totalRatings: 34 },
    { foodName: "Bánh lava chocolate", description: "Bánh chocolate nóng với nhân socola chảy mềm.", price: 55000, category: "Tráng miệng", averageRating: 4.9, totalRatings: 88 }
  ]
};

// ============= SEED FUNCTION =============
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/eatify");
    console.log("✅ Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️ Clearing existing food and seller data...");
    await foodModel.deleteMany({});
    await sellerModel.deleteMany({ sellerID: { $in: restaurants.map(r => r.sellerID) } });

    // Create seller users if not exist
    for (const restaurant of restaurants) {
      const existingUser = await userModel.findOne({ userID: restaurant.userID });
      if (!existingUser) {
        const sellerUser = new userModel({
          userID: restaurant.userID,
          name: restaurant.storeName + " Owner",
          email: restaurant.sellerID.toLowerCase() + "@eatify.com",
          password: "$2b$10$examplehashedpassword", // Dummy hashed password
          role: "seller"
        });
        await sellerUser.save();
        console.log(`👤 Created seller user: ${restaurant.userID}`);
      }
    }

    // Insert restaurants (sellers)
    console.log("🏪 Inserting restaurants...");
    const insertedRestaurants = await sellerModel.insertMany(restaurants);
    console.log(`✅ Inserted ${insertedRestaurants.length} restaurants`);

    // Insert foods for each restaurant
    console.log("🍽️ Inserting foods...");
    let totalFoods = 0;

    for (const restaurant of restaurants) {
      const foods = foodsByRestaurant[restaurant.sellerID];
      
      const foodDocuments = foods.map((food, index) => ({
        foodID: `${restaurant.sellerID}_FOOD_${String(index + 1).padStart(3, '0')}`,
        sellerID: restaurant.sellerID,
        foodName: food.foodName,
        description: food.description,
        price: food.price,
        category: food.category,
        foodImage: `food_${restaurant.sellerID.toLowerCase()}_${index + 1}.jpg`,
        stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
        isAvailable: true,
        averageRating: food.averageRating,
        totalRatings: food.totalRatings
      }));

      await foodModel.insertMany(foodDocuments);
      totalFoods += foodDocuments.length;
      console.log(`  ✅ ${restaurant.storeName}: ${foodDocuments.length} foods`);
    }

    console.log(`\n🎉 Seeding completed!`);
    console.log(`   📊 Total restaurants: ${restaurants.length}`);
    console.log(`   📊 Total foods: ${totalFoods}`);
    console.log(`   📊 Average foods per restaurant: ${totalFoods / restaurants.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();
