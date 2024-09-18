const AuthService = require('../../services/user/AuthService');

// Hàm xử lý đăng ký người dùng
const registerUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    
    // Kiểm tra xem username, phone hoặc email đã tồn tại chưa
    const isUsernameExist = await AuthService.checkUsernameExists(username);
    const isPhoneExist = await AuthService.checkPhoneExists(phone);
    const isEmailExist = await AuthService.checkEmailExists(email);

    if (isUsernameExist) {
      return res.status(400).json({ message: 'Tên người dùng đã tồn tại' });
    }
    if (isPhoneExist) {
      return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
    }
    if (isEmailExist) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo tài khoản mới
    const result = await AuthService.createUser(username, phone, email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng ký' });
  }
};

// Hàm xử lý đăng nhập
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await AuthService.loginUser(username, password);
    res.status(200).json(user);
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(401).json({ message: error });
  }
};

// Hàm xử lý cập nhật thông tin người dùng
const updateUserInfo = async (req, res) => {
  try {
    const { userId, phone, email } = req.body;
    const result = await AuthService.updateUserInfo(userId, phone, email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    res.status(400).json({ message: error.message });
  }
};

// Hàm xử lý đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    res.status(400).json({ message: error.message });
  }
};



module.exports = {updateUserInfo,changePassword,
  registerUser,
  loginUser
};
