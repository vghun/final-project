import cron from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

const Branch = db.Branch;

export default function startBranchStatusCron() {
  // Chạy mỗi ngày lúc 00:00
  cron.schedule("0 0 * * *", async () => {

    // Lấy ngày hiện tại dạng YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    try {
      const activateCount = await Branch.update(
        { status: "Active" },
        {
          where: {
            status: "Inactive",
            resumeDate: { [Op.lte]: today },
          },
        }
      );

      // 2️⃣ Inactive nếu tới suspendDate
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
