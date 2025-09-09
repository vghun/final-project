import db from "../models/index.js";

// Lấy tất cả sản phẩm
export async function getAllProducts() {
  return await db.Product.findAll({
    include: [{ model: db.Category, as: "category" }]
  });
}

// Lấy sản phẩm mới nhất
export async function getLatestProducts() {
  return await db.Product.findAll({
    include: [{ model: db.Category, as: "category" }],
    order: [["createdAt", "DESC"]],
    limit: 8
  });
}

// Lấy sản phẩm bán chạy nhất
export async function getBestSellingProducts() {
  return await db.Product.findAll({
    include: [{ model: db.Category, as: "category" }],
    order: [["sold", "DESC"]],
    limit: 6
  });
}

// Lấy sản phẩm xem nhiều nhất
export async function getMostViewedProducts() {
  return await db.Product.findAll({
    include: [{ model: db.Category, as: "category" }],
    order: [["views", "DESC"]],
    limit: 8
  });
}

// Lấy sản phẩm khuyến mãi cao nhất
export async function getTopDiscountProducts() {
  return await db.Product.findAll({
    include: [{ model: db.Category, as: "category" }],
    order: [["discount", "DESC"]],
    limit: 4
  });
}

// Lấy chi tiết sản phẩm
export async function getProductById(id) {
  return await db.Product.findByPk(id, {
    include: [{ model: db.Category, as: "category" }]
  });
}
