import * as salaryService from "../services/salaryService.js";

// Lấy bảng lương thợ theo tháng/năm (real-time)
export const getSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Thiếu tháng hoặc năm" });
    }

    const salaries = await salaryService.getBarberSalariesOptimized(
      parseInt(month),
      parseInt(year)
    );
    return res.status(200).json(salaries);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Lưu doanh thu cuối tháng vào bảng Salary
export const saveSalaries = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ error: "Thiếu tháng hoặc năm" });
    }

    const result = await salaryService.saveMonthlySalaries(
      parseInt(month),
      parseInt(year)
    );

    if (result.success) {
      return res.status(200).json({ message: result.message });
    } else {
      return res.status(500).json({ error: result.message });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
