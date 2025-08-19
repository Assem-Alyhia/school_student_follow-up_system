import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getGradeById = async (gradeId) => {
  try {
    const url = `${apiEndpoints.getGradeById}/${gradeId}`;
    const res = await axiosInstance.get(url);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
