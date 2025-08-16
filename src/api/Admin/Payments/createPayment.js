import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createPayment = async (payload) => {
  try {
    const response = await axiosInstance.post(
      apiEndpoints.createPayment, 
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
