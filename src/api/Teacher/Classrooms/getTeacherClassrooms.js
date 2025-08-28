import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTeacherClassrooms = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getTeacherClassrooms}?page=${page}&per_page=${perPage}`;
    const res = await axiosInstance.get(url);

    if (res.status !== 200) {
      throw new Error("فشل في جلب الصفوف");
    }

    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب الصفوف"
    );
  }
};
