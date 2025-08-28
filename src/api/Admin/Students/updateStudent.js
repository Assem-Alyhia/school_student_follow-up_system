import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateStudent = async (id, formData) => {
  try {
    const data = new FormData();

    // إضافة _method=PUT لحل مشكلة multipart مع Laravel
    data.append("_method", "PUT");

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    const response = await axiosInstance.post(
      apiEndpoints.updateStudent(id),
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
