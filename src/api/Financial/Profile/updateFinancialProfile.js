// api/Financial/Profile/updateFinancial.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const updateFinancialProfile = async (financialId, formDataObj = {}) => {
  try {
    const data = new FormData();
    data.append("_method", "PUT");

    Object.entries(formDataObj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    const res = await axiosInstance.post(
      apiEndpoints.updateFinancialProfile(financialId),
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data; 
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
