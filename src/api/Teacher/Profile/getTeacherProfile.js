// api/Teacher/getTeacherProfile.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getTeacherProfile = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getTeacherProfile);

    if (response.status !== 200) {
      throw new Error("فشل في جلب بروفايل المعلم");
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب بروفايل المعلم"
    );
  }
};
