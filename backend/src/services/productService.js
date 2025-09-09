import db from "../models/index.js";

// Lấy tất cả sản phẩm
export const getAllProducts = async (page, limit) => {
  if (page && limit) {
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Product.findAndCountAll({
      include: [{ model: db.Category, as: "category" }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      products: rows,
    };
  }
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
  const product = await db.Product.findByPk(id, {
    include: [{ model: db.Category, as: "category", attributes: ["id", "name"] }]
  });

  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,   // ✅ số lượng tồn
    discount: product.discount,
    sold: product.sold,
    views: product.views,
    image: product.image,
    category: product.category ? product.category.name : null,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

