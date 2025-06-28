// getAllUsers.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from './../../axiosInstance';

export const getAllUsers = async (page = 1, perPage = 10) => {
  try {
    const response = await axiosInstance.get(
      `${apiEndpoints.getAllUsers}?page=${page}&per_page=${perPage}`
    );

    if (response.status !== 200) {
      throw new Error("فشل في جلب المستخدمين");
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "حدث خطأ أثناء جلب المستخدمين"
    );
  }
};
