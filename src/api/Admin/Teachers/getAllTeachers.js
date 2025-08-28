import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllTeachers = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllTeachers}?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب المعلمين");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب المعلمين"
    );
  }
};
