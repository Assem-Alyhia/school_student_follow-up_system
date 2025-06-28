import axiosInstance from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";

// 1. طلب إرسال رابط استعادة كلمة المرور (فورغيت)
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.forgotPassword, {
      email,
    });
    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};

// 2. إعادة تعيين كلمة المرور باستخدام رمز التحقق (Reset)
export const resetPassword = async (
  token,
  email,
  password,
  password_confirmation
) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.resetPassword, {
      token,
      email,
      password,
      password_confirmation,
    });
    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset failed"
    );
  }
};

// 3. تغيير كلمة المرور للمستخدم المسجل دخول (Change Password)
export const changePassword = async (
  current_password,
  password,
  password_confirmation
) => {
  try {
    const response = await axiosInstance.post(apiEndpoints.changePassword, {
      current_password,
      password,
      password_confirmation,
    });
    if (response.data.status === "failed") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Change password failed"
    );
  }
};
