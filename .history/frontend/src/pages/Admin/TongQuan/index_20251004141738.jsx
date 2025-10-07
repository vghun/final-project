import React from "react";
import classNames from "classnames/bind";
import styles from "./TongQuan.module.scss";

const cx = classNames.bind(styles);

function TongQuan() {
  return (
    <div className={cx("tongQuan")}>
      <div className={cx("cardGrid")}>
        <div className={cx("card")}>
          <h3>Doanh thu tháng</h3>
          <p className={cx("value")}>115.000.000đ</p>
          <span>+12.5% so với tháng trước</span>
        </div>
        <div className={cx("card")}>
          <h3>Tổng khách hàng</h3>
          <p className={cx("value")}>1247</p>
          <span>Khách hàng đã phục vụ</span>
        </div>
        <div className={cx("card")}>
          <h3>Lịch hẹn tháng</h3>
          <p className={cx("value")}>2156</p>
          <span>Tổng số lịch hẹn</span>
        </div>
        <div className={cx("card")}>
          <h3>Đánh giá trung bình</h3>
          <p className={cx("value")}>4.8 ⭐</p>
          <span>Từ tất cả chi nhánh</span>
        </div>
      </div>
    </div>
  );
}

export default TongQuan;
