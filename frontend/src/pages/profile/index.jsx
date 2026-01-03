import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useAuth } from "~/context/AuthContext";
import { ProfileAPI } from "~/apis/profileApi";
import { useToast } from "~/context/ToastContext";
import styles from "./Profile.module.scss";
import WorkCard from "~/components/CustomerGalleryCard";
import { fetchCustomerGallery } from "~/services/customerGalleryService";

const cx = classNames.bind(styles);

function Profile() {
  const { accessToken, setUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("/user.png");

  // gallery
  const [galleryWorks, setGalleryWorks] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  /* =======================
     FETCH PROFILE (FIX LOOP)
     ======================= */
  useEffect(() => {
    if (!accessToken) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await ProfileAPI.getProfile(accessToken);
        const userProfile = res.profile;

        setProfile(userProfile);
        setFullName(userProfile.fullName || "");
        setPhoneNumber(userProfile.phoneNumber || "");
        setPreview(userProfile.image || "/user.png");
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
  }, [accessToken]); // ❗ CHỈ accessToken

  /* =======================
     FETCH GALLERY
     ======================= */
  useEffect(() => {
    if (!accessToken) return;

    const loadGallery = async () => {
      setGalleryLoading(true);
      try {
        const data = await fetchCustomerGallery(accessToken);

        const grouped = {};
        data.forEach((item) => {
          const id = item.idbooking;
          if (!grouped[id]) {
            grouped[id] = {
              idBooking: id,
              customerName: item.customerName,
              barberName: item.barberName,
              service: item.service,
              description: item.description || "",
              date: item.date,
              photos: [],
            };
          }
          grouped[id].photos.push(item.photo);
        });

        setGalleryWorks(Object.values(grouped));
      } catch (err) {
        console.error("Lỗi khi tải gallery:", err);
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGallery();
  }, [accessToken]);

  /* =======================
     HANDLERS
     ======================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phoneNumber)) {
      showToast({
        text: "Số điện thoại không hợp lệ!",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await ProfileAPI.updateProfile(accessToken, formData);
      const updatedProfile = res.profile || res;

      setProfile(updatedProfile);
      setPreview(updatedProfile.image || "/user.png");

      setUser((prev) => ({
        ...prev,
        ...updatedProfile,
        avatar: updatedProfile.image || "/user.png",
      }));

      showToast({
        text: "Cập nhật thành công!",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      showToast({
        text: "Có lỗi khi cập nhật!",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleChangePassword = () => {
    showToast({
      text: "Đổi mật khẩu thành công!",
      type: "success",
      duration: 3000,
    });
  };

  /* =======================
     RENDER
     ======================= */
  if (loading) return <div className={cx("loading")}>Đang tải...</div>;
  if (!profile) return <div className={cx("loading")}>Không có dữ liệu</div>;

  const { email, profileDetail } = profile;
  const points = profileDetail?.loyaltyPoint || 0;

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
                  hidden
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
      <div className={styles.container}>
        <h2 className={styles.title}>Ảnh sau khi cắt tóc</h2>
        {galleryLoading ? (
          <p>Đang tải...</p>
        ) : galleryWorks.length > 0 ? (
          <div className={styles.grid}>
            {galleryWorks.map((work) => (
              <WorkCard key={work.idBooking} work={work} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>Chưa có ảnh nào</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
