import * as salaryService from "../services/salaryService.js";

// Lấy bảng lương thợ theo tháng/năm
export const getSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Thiếu tháng hoặc năm" });
    }

    const salaries = await salaryService.getBarberSalariesOptimized(parseInt(month), parseInt(year));
    return res.status(200).json(salaries);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// export const calculateSalaries = async (req, res) => {
//   try {
//     const { month, year } = req.body;

//     if (!month || !year) {
//       return res.status(400).json({ error: "Thiếu tháng hoặc năm" });
//     }

//     const result = await salaryService.calculateAndSaveSalaries(parseInt(month), parseInt(year));
//     return res.status(200).json({ message: "Đã tính lương", data: result });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
