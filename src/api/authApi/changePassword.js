import axiosInstance, { SESSION_EXPIRED_CODE } from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";


export const changePassword = async (
  current_password,
  password,
  password_confirmation
) => {
  const endpoint = apiEndpoints?.changePassword ?? "change-password";

  try {
    const res = await axiosInstance.post(endpoint, {
      current_password,
      password,
      password_confirmation,
    });

    if (res?.data?.status === "failed" || res?.status !== 200) {
      throw new Error(res?.data?.message || "فشل تغيير كلمة المرور");
    }

    return res.data;
  } catch (error) {
    if (error?.code === SESSION_EXPIRED_CODE) {
      throw new Error("انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.");
    }
    throw new Error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "حدث خطأ أثناء تغيير كلمة المرور"
    );
  }
};
