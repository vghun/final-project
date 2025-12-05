import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./DichVu.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import ServiceAPI from "~/apis/serviceAPI";
import { BranchAPI } from "~/apis/branchAPI";
import ServiceFormModal from "~/components/ServiceFormModal";

const cx = classNames.bind(styles);

function DichVu() {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const s = await ServiceAPI.getAll();
    const b = await BranchAPI.getAll();
    setServices(s);
    setBranches(b);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className={cx("serviceList")}>
      <h2>Quản lý dịch vụ</h2>

      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Thời lượng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr key={s.idService}>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{parseInt(s.price).toLocaleString()} đ</td>
              <td>{s.duration} phút</td>
              <td>
                <span className={cx(s.status === "Active" ? "active" : "inactive")}>
                  {s.status === "Active" ? "Hoạt động" : "Ngừng"}
                </span>
              </td>
              <td>
                <button
                className={cx("editBtn")}
                onClick={() => {
                  setSelectedService(s.idService); // chỉ truyền id
                  setFormVisible(true);
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal details */}
     <ServiceFormModal
  show={formVisible}
  onClose={() => setFormVisible(false)}
  serviceId={selectedService}
  branches={branches}
  onUpdated={fetchAll}
/>

    </div>
  );
}

export default DichVu;
