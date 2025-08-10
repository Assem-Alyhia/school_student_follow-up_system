import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createUser = async (formData) => {
  try {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    const response = await axiosInstance.post(apiEndpoints.createUser, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
