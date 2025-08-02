import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateUser = async (id, formData) => {
  try {
    const data = new FormData();
    data.append("_method", "PUT");

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    const response = await axiosInstance.post(
      apiEndpoints.updateUser(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
