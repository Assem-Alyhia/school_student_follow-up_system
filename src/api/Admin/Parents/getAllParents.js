import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllParents = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllParents}?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب أولياء الأمور");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "حدث خطأ أثناء جلب أولياء الأمور"
    );
  }
};
