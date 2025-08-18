// api/Teacher/Parents/getTeacherParents.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherParents = async (page = 1, perPage = 10) => {
  try {
    const url = `${apiEndpoints.getTeacherParents}?page=${page}&per_page=${perPage}`;
    const response = await axiosInstance.get(url);

    if (response.status !== 200) {
      throw new Error("فشل في جلب أولياء الأمور");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب أولياء الأمور"
    );
  }
};
