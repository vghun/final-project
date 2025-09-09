import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SideBarFilter.module.scss";
import CustomSelect from "../CustomSelect";

const cx = classNames.bind(styles);

function SidebarFilter() {
  const [price, setPrice] = useState(0);
  return (
    <aside className={cx("sidebar")}>
      <h3 className={cx("title")}>
        <i className="fa-solid fa-filter"></i> Bộ lọc
      </h3>

      {/* Tìm kiếm */}
      <div className={cx("filter-group")}>
        <label htmlFor="search">Tìm kiếm</label>
        <input
          id="search"
          type="text"
          placeholder="Tên sản phẩm, thương hiệu..."
        />
      </div>

      {/* Danh mục */}
      <div className={cx("filter-group")}>
        <label>Danh mục</label>
        <CustomSelect
          options={[
            "Tất cả danh mục",
            "Sáp tóc",
            "Gel tóc",
            "Dầu gội",
            "Serum",
            "Pomade",
            "Dầu xả",
            "Mousse",
            "Spray",
          ]}
          defaultValue="Tất cả danh mục"
          onChange={(val) => console.log("Chọn danh mục:", val)}
        />
      </div>

      {/* Thương hiệu */}
      <div className={cx("filter-group")}>
        <label>Thương hiệu</label>
        <CustomSelect
          options={[
            "Tất cả thương hiệu",
            "BarberPro",
            "NaturalCare",
            "HairVital",
          ]}
          defaultValue="Tất cả thương hiệu"
          onChange={(val) => console.log("Chọn thương hiệu:", val)}
        />
      </div>

      {/* Giá tối thiểu */}
      <div className={cx("filter-group")}>
        <label>Giá tối thiểu: {price}</label>
        <input
          type="range"
          min="0"
          max="500000"
          step="50000"
          defaultValue="0"
          className={cx("range")}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Checkbox */}
      <div className={cx("filter-group", "checkbox")}>
        <input type="checkbox" id="inStock" />
        <label htmlFor="inStock">Chỉ hiển thị có sẵn</label>
      </div>

      {/* Sắp xếp */}
      <div className={cx("filter-group")}>
        <label>Sắp xếp theo</label>
        <CustomSelect
          options={["Nổi bật", "Giá tăng dần", "Giá giảm dần"]}
          defaultValue="Nổi bật"
          onChange={(val) => console.log("Sắp xếp:", val)}
        />
      </div>
    </aside>
  );
}

export default SidebarFilter;
