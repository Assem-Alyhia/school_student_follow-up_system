import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.deleteUser(id));
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "فشل في حذف المستخدم"
    );
  }
};
