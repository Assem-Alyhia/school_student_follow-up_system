import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getSupervisorStudentLocation = async (supervisorId) => {
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getSupervisorStudentLocation,
      {
        params: supervisorId ? { supervisor_id: supervisorId } : undefined,
      }
    );
    return res.data; 
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
