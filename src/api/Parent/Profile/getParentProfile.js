import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getParentProfile = async () => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getParentProfile);

    if (response.status !== 200) {
      throw new Error("فشل في جلب بروفايل الأب");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء جلب بروفايل الأب"
    );
  }
};
