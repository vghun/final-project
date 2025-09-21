import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useAuth } from "~/context/AuthContext";
import { ProfileAPI } from "~/apis/profileApi";
import { useToast } from "~/context/ToastContext"; 
import styles from "./Profile.module.scss";

const cx = classNames.bind(styles);

function Profile() {
  // Sửa: lấy đúng accessToken từ context
  const { accessToken, user, setUser } = useAuth();
  const { showToast } = useToast();  

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // state form
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Fetch profile khi accessToken có giá trị
  useEffect(() => {
    if (!accessToken) return;

    const fetchProfile = async () => {
      try {
        const res = await ProfileAPI.getProfile(accessToken);
        console.log("fetchProfile res:", res);
        setProfile(res.user);

        setFullName(res.user.fullName);
        setPhoneNumber(res.user.phoneNumber);
        setPreview(res.user.image || "/user.png");
      } catch (err) {
        console.error("Lỗi khi tải profile:", err);
        showToast({
          text: "Lỗi khi tải dữ liệu!",
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, showToast]);

  if (loading) return <div className={cx("loading")}>Đang tải...</div>;
  if (!profile) return <div className={cx("loading")}>Không có dữ liệu</div>;

  const { email, points = 0, gallery = [] } = profile;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = async () => {
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phoneNumber)) {
      showToast({ text: "Số điện thoại không hợp lệ!", type: "error", duration: 3000 });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      if (avatarFile) formData.append("avatar", avatarFile);

      const updatedProfile = await ProfileAPI.updateProfile(accessToken, formData);

      showToast({ text: "Cập nhật thành công!", type: "success", duration: 3000 });

      // Cập nhật context user và preview
      setUser({
        ...updatedProfile.user,
        avatar: updatedProfile.user.image || "/user.png",
      });
      setPreview(updatedProfile.user.image || "/user.png");
      setProfile(updatedProfile.user);
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      showToast({ text: "Có lỗi khi cập nhật!", type: "error", duration: 3000 });
    }
  };

  const handleChangePassword = () => {
    showToast({
      text: "Đổi mật khẩu thành công!",
      type: "success",
      duration: 3000,
    }); 
  };

  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>Tài khoản của tôi</h1>

      <div className={cx("account-layout")}>
        {/* Sidebar */}
        <div className={cx("sidebar")}>
          <button
            className={cx("menu-item", { active: activeTab === "profile" })}
            onClick={() => setActiveTab("profile")}
          >
            Hồ sơ
          </button>
          <button
            className={cx("menu-item", { active: activeTab === "password" })}
            onClick={() => setActiveTab("password")}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Content */}
        <div className={cx("content")}>
          {activeTab === "profile" && (
            <div className={cx("profile-card")}>
              <div className={cx("avatar")}>
                <img src={preview} alt="avatar" />
                <input
                  type="file"
                  id="avatarUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="avatarUpload" className={cx("upload-btn")}>
                  Tải ảnh lên
                </label>
              </div>

              <div className={cx("info")}>
                <div className={cx("form-group")}>
                  <label>Họ và Tên:</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className={cx("form-group")}>
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className={cx("form-group")}>
                  <label>Email:</label>
                  <p className={cx("email")}>{email}</p>
                </div>

                <p className={cx("points")}>
                  <strong>Điểm tích luỹ:</strong> {points}
                </p>

                <button className={cx("save-btn")} onClick={handleEditProfile}>
                  Cập nhật
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className={cx("password-card")}>
              <h2>Đổi mật khẩu</h2>
              <input type="password" placeholder="Mật khẩu mới" />
              <input type="password" placeholder="Xác nhận mật khẩu" />
              <button className={cx("save-btn")} onClick={handleChangePassword}>
                Đổi mật khẩu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className={cx("gallery")}>
        <h2>Ảnh sau khi cắt tóc</h2>
        {gallery.length === 0 ? (
          <p className={cx("no-gallery")}>Chưa có ảnh nào</p>
        ) : (
          <div className={cx("gallery-grid")}>
            {gallery.map((img, idx) => (
              <div key={idx} className={cx("gallery-item")}>
                <img src={img} alt={`Haircut ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
