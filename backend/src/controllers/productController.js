import * as productService from "../services/productService.js";

export const getAll = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getLatest = async (req, res) => {
  try {
    const products = await productService.getLatestProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getBestSelling = async (req, res) => {
  try {
    const products = await productService.getBestSellingProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getMostViewed = async (req, res) => {
  try {
    const products = await productService.getMostViewedProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getTopDiscount = async (req, res) => {
  try {
    const products = await productService.getTopDiscountProducts();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
