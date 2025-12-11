import cron from "node-cron";
import db from "../models/index.js"; // import đúng file index.js
import { Op } from "sequelize";

const Branch = db.Branch; // lấy model Branch từ db

export default function startBranchStatusCron() {
  // Cron chạy mỗi ngày lúc 00:00
  cron.schedule("0 0 * * *", async () => {
    console.log("Running branch status update job...");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // bỏ giờ phút giây để so sánh ngày

    try {
      // 1️⃣ Chuyển từ Inactive -> Active nếu resumeDate đến
      const activateCount = await Branch.update(
        { status: "Active" },
        {
          where: {
            status: "Inactive",
            resumeDate: { [Op.lte]: today },
          },
        }
      );

      // 2️⃣ Chuyển từ Active -> Inactive nếu suspendDate đến
      const suspendCount = await Branch.update(
        { status: "Inactive" },
        {
          where: {
            status: "Active",
            suspendDate: { [Op.lte]: today },
          },
        }
      );

      console.log(
        `Branch status update completed! Activated: ${activateCount[0]}, Suspended: ${suspendCount[0]}`
      );
    } catch (err) {
      console.error("Error updating branch status:", err);
    }
  });
}
