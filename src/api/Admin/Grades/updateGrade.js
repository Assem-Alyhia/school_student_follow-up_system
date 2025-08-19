import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const updateGrade = async (gradeId, payload) => {
  try {
    const url = `${apiEndpoints.updateGrade}/${gradeId}`;
    const res = await axiosInstance.put(url, payload);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
