import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getPaymentById = async (id) => {
  try {
    const response = await axiosInstance.get(
      apiEndpoints.getStudentPaymentById(id)
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw error;
  }
};
