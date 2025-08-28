// services/supervisor.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const storeSupervisorLocation = async (latitude, longitude) => {
  try {
    const res = await axiosInstance.post(
      apiEndpoints.storeSupervisorLocation,
      { latitude, longitude }
    );
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
