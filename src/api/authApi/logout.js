import { clearToken } from "./tokenManager";

export const logout = () => {
  // امسح كل البيانات الخاصة بالجلسة
  clearToken();

  // أعد التوجيه لصفحة تسجيل الدخول
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};
