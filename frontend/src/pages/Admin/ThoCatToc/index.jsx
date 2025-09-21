import React from "react";
import classNames from "classnames/bind";
import styles from "./ThoCatToc.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPenToSquare,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const barbers = [
  {
    id: 1,
    name: "Minh Tuấn",
    branch: "Chi nhánh Quận 1",
    exp: "8 năm",
    rating: 4.9,
    revenue: "12.500.000đ",
    customers: 156,
  },
  {
    id: 2,
    name: "Hoàng Nam",
    branch: "Chi nhánh Quận 1",
    exp: "5 năm",
    rating: 4.7,
    revenue: "9.800.000đ",
    customers: 124,
  },
  {
    id: 3,
    name: "Thanh Sơn",
    branch: "Chi nhánh Quận 3",
    exp: "6 năm",
    rating: 4.8,
    revenue: "11.200.000đ",
    customers: 142,
  },
];

function ThoCatToc() {
  return (
    <div className={cx("barberList")}>
      <div className={cx("header")}>
        <h2>Quản lý thợ cắt tóc</h2>
        <button className={cx("addBtn")}>
          <FontAwesomeIcon icon={faPlus} /> Thêm thợ cắt tóc
        </button>
      </div>

      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Thợ cắt tóc</th>
            <th>Chi nhánh</th>
            <th>Kinh nghiệm</th>
            <th>Đánh giá</th>
            <th>Doanh thu</th>
            <th>Khách hàng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {barbers.map((b) => (
            <tr key={b.id}>
              <td>
                <div className={cx("barberCell")}>
                  <span className={cx("avatar")}>{b.name.charAt(0)}</span>
                  <span>{b.name}</span>
                </div>
              </td>
              <td>{b.branch}</td>
              <td>{b.exp}</td>
              <td className={cx("rating")}>
                <FontAwesomeIcon icon={faStar} className={cx("star")} />{" "}
                {b.rating}
              </td>
              <td>{b.revenue}</td>
              <td>{b.customers}</td>
              <td>
                <div className={cx("actions")}>
                  <button className={cx("editBtn")}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button className={cx("deleteBtn")}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ThoCatToc;
