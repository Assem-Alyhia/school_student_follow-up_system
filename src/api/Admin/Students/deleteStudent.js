import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.delete(apiEndpoints.deleteStudent(id));
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "فشل في حذف الطالب"
    );
  }
};
