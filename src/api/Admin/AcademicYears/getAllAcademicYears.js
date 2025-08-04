import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllAcademicYears = async () => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getAllAcademicYearsNoPaginate
    );
    return response.data.data; // حسب ما يرجعه السيرفر
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
