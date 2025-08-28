import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentProfile = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getStudentProfile);
    if (res.status !== 200) {
      throw new Error("فشل في جلب بروفايل الطالب");
    }
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بروفايل الطالب"
    );
  }
};
