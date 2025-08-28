import classNames from "classnames/bind";
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("sidebar")}>
        <div className={cx("avatar")}>
          <span className={cx("avatar-icon")}>👤</span>
        </div>
        <h2 className={cx("name")}>Nguyễn Văn A</h2>
        <p className={cx("role")}>Khách hàng VIP</p>
        <button className={cx("btn")}>Chỉnh sửa ảnh đại diện</button>

        <div className={cx("stats")}>
          <div>
            <p>24</p>
            <span>Lần cắt tóc</span>
          </div>
          <div>
            <p>1,250</p>
            <span>Điểm tích lũy</span>
          </div>
        </div>
      </div>

      <div className={cx("content")}>
        <h3>Thông tin cá nhân</h3>
        <div className={cx("info")}>
          <p>
            <strong>Email:</strong> nguyenvana@email.com
          </p>
          <p>
            <strong>Số điện thoại:</strong> 0901234567
          </p>
          <p>
            <strong>Ngày sinh:</strong> 15/01/1990
          </p>
          <p>
            <strong>Địa chỉ:</strong> 123 Nguyễn Huệ, Quận 1, TP.HCM
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
