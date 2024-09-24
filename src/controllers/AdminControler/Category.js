const CategoryService = require("../../services/admin/CategoryService");

// Tạo danh mục
const createCategory = async (req, res) => {
  try {
    const categoryId = await CategoryService.createCategory(req.body.name, req.body.description);
    return res.status(200).json({ categoryId });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Cập nhật thông tin danh mục
const updateCategory = async (req, res) => {
  try {
    const result = await CategoryService.updateCategory(req.body.category_id, req.body.name, req.body.description);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const result = await CategoryService.deleteCategory(req.body.category_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Thêm danh mục vào bài toán
const addCategoryToProblem = async (req, res) => {
  try {
    const result = await CategoryService.addCategoryToProblem(req.body.problem_id, req.body.category_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa danh mục khỏi bài toán
const removeCategoryFromProblem = async (req, res) => {
  try {
    const result = await CategoryService.removeCategoryFromProblem(req.body.problem_id, req.body.category_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Lấy toàn bộ danh mục
const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await CategoryService.getAllCategories(page);
    return res.status(200).json({
      categories: result.categories,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalCategories: result.totalCategories
    });
  } catch (e) {
    return res.status(404).json({ error: "Không thể lấy danh sách danh mục" });
  }
};
const getCategoryInfo = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const result = await CategoryService.getCategoryInfo(categoryId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};
const getProblemsInCategoryStatus = async (req, res) => {
  try {
    const { id, page = 1, limit = 10, search = '' } = req.query;
    const result = await CategoryService.getProblemsInCategoryStatus(id, page, limit, search);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách bài toán trong danh mục: ' + e.message });
  }
};
const getProblemsInCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await CategoryService.getProblemsInCategory(req.query.id, page, limit);
    return res.status(200).json({
      problems: result.problems,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalProblems: result.totalProblems
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
};



module.exports = {getProblemsInCategory,getProblemsInCategoryStatus,getCategoryInfo,
  createCategory,
  updateCategory,
  deleteCategory,
  addCategoryToProblem,
  removeCategoryFromProblem,
  getAllCategories
};

