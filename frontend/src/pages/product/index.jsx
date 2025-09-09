import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import SidebarFilter from "~/components/SideBarFilter";
import ProductCard from "~/components/ProductCard";

const cx = classNames.bind(styles);

const data = [
  {
    id: 1,
    image: "https://via.placeholder.com/400x300",
    badge: "Nổi bật",
    category: "Sáp tóc",
    name: "Sáp vuốt tóc Premium",
    brand: "BarberPro",
    rating: 4.7,
    reviews: 89,
    description: "Sáp vuốt tóc cao cấp với độ bám tốt, không gây bết dính",
    price: 250000,
    oldPrice: 300000,
    outOfStock: false,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/400x300",
    badge: "Nổi bật",
    category: "Dầu gội",
    name: "Dầu gội thảo dược",
    brand: "NaturalCare",
    rating: 4.8,
    reviews: 124,
    description: "Dầu gội từ thảo dược tự nhiên, dịu nhẹ cho da đầu",
    price: 320000,
    oldPrice: null,
    outOfStock: false,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/400x300",
    badge: "Hết hàng",
    category: "Serum",
    name: "Serum dưỡng tóc",
    brand: "HairVital",
    rating: 4.9,
    reviews: 156,
    description: "Serum phục hồi và dưỡng ẩm cho tóc khô xơ",
    price: 450000,
    oldPrice: null,
    outOfStock: true,
  },
  {
    id: 4,
    image: "https://via.placeholder.com/400x300",
    badge: "Nổi bật",
    category: "Pomade",
    name: "Pomade Classic Hold",
    brand: "StyleMan",
    rating: 4.6,
    reviews: 65,
    description: "Pomade cổ điển giữ nếp bóng mượt cả ngày",
    price: 280000,
    oldPrice: 320000,
    outOfStock: false,
  },
  {
    id: 5,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Dầu xả",
    name: "Dầu xả dưỡng tóc mềm mượt",
    brand: "SmoothCare",
    rating: 4.5,
    reviews: 42,
    description: "Dưỡng chất giúp tóc mềm mại và óng ả",
    price: 210000,
    oldPrice: null,
    outOfStock: false,
  },
  {
    id: 6,
    image: "https://via.placeholder.com/400x300",
    badge: "Nổi bật",
    category: "Gel tóc",
    name: "Gel tạo kiểu Strong Hold",
    brand: "FixHair",
    rating: 4.2,
    reviews: 73,
    description: "Giữ nếp cực mạnh, không lo gãy tóc",
    price: 180000,
    oldPrice: 200000,
    outOfStock: false,
  },
  {
    id: 7,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Mousse",
    name: "Mousse tạo phồng tóc",
    brand: "VoluMax",
    rating: 4.3,
    reviews: 51,
    description: "Giúp tóc bồng bềnh tự nhiên cả ngày",
    price: 230000,
    oldPrice: null,
    outOfStock: false,
  },
  {
    id: 8,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Spray",
    name: "Xịt dưỡng tóc bảo vệ nhiệt",
    brand: "ThermoShield",
    rating: 4.4,
    reviews: 38,
    description: "Ngăn ngừa hư tổn do nhiệt khi tạo kiểu",
    price: 260000,
    oldPrice: null,
    outOfStock: false,
  },
  {
    id: 9,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Serum",
    name: "Serum bóng tóc",
    brand: "ShinyHair",
    rating: 4.7,
    reviews: 92,
    description: "Mang lại mái tóc óng ả rạng ngời",
    price: 350000,
    oldPrice: 400000,
    outOfStock: false,
  },
  {
    id: 10,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Dầu gội",
    name: "Dầu gội phục hồi hư tổn",
    brand: "RepairPlus",
    rating: 4.6,
    reviews: 88,
    description: "Phục hồi tóc hư tổn do hóa chất",
    price: 370000,
    oldPrice: 420000,
    outOfStock: false,
  },
  {
    id: 11,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Sáp tóc",
    name: "Sáp vuốt tóc Matte Finish",
    brand: "UrbanStyle",
    rating: 4.3,
    reviews: 59,
    description: "Cho mái tóc tự nhiên, không bóng nhờn",
    price: 240000,
    oldPrice: null,
    outOfStock: false,
  },
  {
    id: 12,
    image: "https://via.placeholder.com/400x300",
    badge: "Nổi bật",
    category: "Xịt dưỡng",
    name: "Spray dưỡng ẩm tóc",
    brand: "HydraHair",
    rating: 4.9,
    reviews: 147,
    description: "Bổ sung độ ẩm tức thì cho tóc khô",
    price: 330000,
    oldPrice: 360000,
    outOfStock: false,
  },
  {
    id: 13,
    image: "https://via.placeholder.com/400x300",
    badge: "",
    category: "Dầu xả",
    name: "Dầu xả phục hồi",
    brand: "RevitaCare",
    rating: 4.5,
    reviews: 64,
    description: "Nuôi dưỡng tóc từ gốc đến ngọn",
    price: 270000,
    oldPrice: null,
    outOfStock: false,
  },
];

function Product() {
  // 🔹 Dữ liệu giả lập

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <div className={cx("header")}>
          <h2>Sản phẩm chăm sóc tóc</h2>
          <p>Các sản phẩm chất lượng cao cho việc chăm sóc tóc tại nhà</p>
        </div>

        <div className={cx("section")}>
          <div className={cx("left-section")}>
            <SidebarFilter />
          </div>

          <div className={cx("right-section")}>
            <p>Tìm thấy {data.length} sản phẩm</p>
            <div className={cx("product-list")}>
              {data.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
