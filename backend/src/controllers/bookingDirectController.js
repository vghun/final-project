import db from "../models/index.js";

export const findCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ message: "Thiếu số điện thoại!" });
    }

    const user = await db.User.findOne({
      where: { phoneNumber: phone },
      include: [
        {
          model: db.Customer,
          as: "customer",
        },
      ],
    });

    if (!user) {
      return res.status(200).json({
        exists: false,
        name: "Khách vãng lai",
        idCustomer: null,
      });
    }

    // Nếu tồn tại user có vai trò customer
    if (user.role === "customer") {
      return res.status(200).json({
        exists: true,
        name: user.fullName,
        idCustomer: user.customer ? user.customer.idCustomer : null,
      });
    }

    // Nếu có user nhưng không phải khách hàng
    return res.status(200).json({
      exists: false,
      name: "Khách vãng lai",
      idCustomer: null,
    });
  } catch (error) {
    console.error("Error in findCustomerByPhone:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
};
