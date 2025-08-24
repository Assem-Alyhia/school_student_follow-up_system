import axiosInstance, { AUTH_SKIP_HEADER } from "../axiosInstance";
import apiEndpoints from "../apiEndpoints";

export const forgotPassword = async (email) => {
  const endpoint = apiEndpoints?.forgotPassword ?? "forgot-password";

  const postOnce = () =>
    axiosInstance.post(
      endpoint,
      { email },
      {
        headers: {
          [AUTH_SKIP_HEADER]: true,
          Authorization: undefined,
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

  try {
    const res = await postOnce();

    if (res?.data?.status === "failed" || ![200, 204].includes(res?.status)) {
      throw new Error(res?.data?.message || "فشل في إرسال رابط إعادة التعيين");
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
          retry?.data?.message || "فشل في إرسال رابط إعادة التعيين"
        );
      }
      return retry.data;
    }

    throw new Error(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "حدث خطأ أثناء إرسال رابط إعادة التعيين"
    );
  }
};
