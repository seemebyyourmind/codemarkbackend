const SubmitService = require("../../services/admin/SubmitService");

// Tạo submit mới
const createSubmit = async (req, res) => {
  try {
    const { user_id, problem_id, source, language_id } = req.body;
    const submit_id = await SubmitService.createSubmit(user_id, problem_id, source, language_id);
    return res.status(200).json({ submit_id });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Cập nhật kết quả submit
const updateSubmitResult = async (req, res) => {
  try {
    const { submit_id, status, numberTestcasePass, numberTestcase, points, error, timeExecute, memoryUsage } = req.body;
    const result = await SubmitService.updateSubmitResult(submit_id, status, numberTestcasePass, numberTestcase, points, error, timeExecute, memoryUsage);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Xóa submit
const deleteSubmit = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await SubmitService.deleteSubmit(id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy thông tin submit theo ID
const getSubmitById = async (req, res) => {
  try {
    const { id } = req.query;
    const submit = await SubmitService.getSubmitById(id);
    return res.status(200).json({ submit });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy danh sách submit theo user_id và problem_id
const getSubmitsByUserAndProblem = async (req, res) => {
  try {
    const { user_id, problem_id } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const submits = await SubmitService.getSubmitsByUserAndProblem(user_id, problem_id, page, limit);
    return res.status(200).json({ submits });
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};
// Lấy danh sách submit theo user_id
const getSubmitsByUserId = async (req, res) => {
  try {
    const  user_id  = req.query.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const submits = await SubmitService.getSubmitsByUserId(user_id, page, limit);
    return res.status(200).json(submits);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy danh sách submit theo problem_id
const getSubmitsByProblemId = async (req, res) => {
  try {
    const  problem_id  = req.query.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const submits = await SubmitService.getSubmitsByProblemId(problem_id, page, limit);
    return res.status(200).json(submits);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy danh sách submit có phân trang
const getSubmitsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const sortBy = req.query.sort || 'submit_id';
    const submits = await SubmitService.getSubmitsWithPagination(page, limit, sortBy);
    return res.status(200).json(submits);
  } catch (e) {
    return res.status(500).json({ error: `Lỗi khi lấy danh sách submit: ${e.message}` });
  }
};

module.exports = {getSubmitsWithPagination,getSubmitsByUserId,getSubmitsByProblemId,
  createSubmit,
  updateSubmitResult,
  deleteSubmit,
  getSubmitById,
  getSubmitsByUserAndProblem
};