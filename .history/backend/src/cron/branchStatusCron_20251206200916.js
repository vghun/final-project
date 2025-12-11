import cron from "node-cron";
import { Branch } from "../models"; // sửa đường dẫn tới model của bạn
import { Op } from "sequelize";

export default function startBranchStatusCron() {
  // Chạy mỗi ngày lúc 00:00
  cron.schedule("0 0 * * *", async () => {
    console.log("Running branch status update job...");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Chuyển từ Inactive -> Active nếu resumeDate đến
      await Branch.update(
        { status: "Active" },
        { where: { status: "Inactive", resumeDate: { [Op.lte]: today } } }
      );

      // Chuyển từ Active -> Inactive nếu suspendDate đến
      await Branch.update(
        { status: "Inactive" },
        { where: { status: "Active", suspendDate: { [Op.lte]: today } } }
      );

      console.log("Branch status update completed!");
    } catch (err) {
      console.error("Error updating branch status:", err);
    }
  });
}
