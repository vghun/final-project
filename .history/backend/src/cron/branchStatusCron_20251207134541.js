import cron from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

const Branch = db.Branch;
console.log(">>> Cron function file LOADED");
export default function startBranchStatusCron() {
     console.log(">>> Cron function INITIALIZED");
  cron.schedule(
    "0 0 * * *",
    async () => {
      console.log("Cron chạy lúc:", new Date().toLocaleString("vi-VN"));

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

        const suspendCount = await Branch.update(
          { status: "Inactive" },
          {
            where: {
              status: "Active",
              suspendDate: { [Op.lte]: today },
            },
          }
        );

        console.log("Result:", { activateCount, suspendCount });
      } catch (err) {
        console.error("Error updating branch status:", err);
      }
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    }
  );
}
