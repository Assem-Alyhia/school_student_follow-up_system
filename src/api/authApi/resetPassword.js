import axiosInstance, { AUTH_SKIP_HEADER } from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";

export const resetPassword = async (
  token,
  email,
  password,
  password_confirmation
) => {
  const endpoint = apiEndpoints?.resetPassword ?? "reset-password";
  const payload = { token, email, password, password_confirmation };

  const postOnce = () =>
    axiosInstance.post(endpoint, payload, {
      headers: {
        [AUTH_SKIP_HEADER]: true,
        Authorization: undefined,
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

  try {
    const res = await postOnce();

    if (res?.data?.status === "failed" || ![200, 204].includes(res?.status)) {
      throw new Error(res?.data?.message || "فشل في إعادة تعيين كلمة المرور");
    }

    return res.data;
  } catch (err) {
    if (err?.response?.status === 419) {
      await axiosInstance.get("/sanctum/csrf-cookie", {
        headers: { [AUTH_SKIP_HEADER]: true },
        withCredentials: true,
      });
      const retry = await postOnce();
      if (retry?.data?.status === "failed") {
        throw new Error(
          retry?.data?.message || "فشل في إعادة تعيين كلمة المرور"
        );
      }
      return retry.data;
    }

    throw new Error(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "حدث خطأ أثناء إعادة التعيين"
    );
  }
};
