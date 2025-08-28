import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherLevels = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getTeacherLevels);

    if (response.status !== 200) {
      throw new Error("فشل في جلب المراحل الدراسية");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب المراحل الدراسية"
    );
  }
};
