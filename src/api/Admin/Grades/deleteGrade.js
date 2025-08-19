import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const deleteGrade = async (gradeId) => {
  try {
    const url = `${apiEndpoints.deleteGrade}/${gradeId}`;
    const res = await axiosInstance.delete(url);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
