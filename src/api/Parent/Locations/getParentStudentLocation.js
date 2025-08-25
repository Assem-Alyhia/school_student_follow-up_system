// api/Parent/Locations/getParentStudentLocation.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getParentStudentLocation = async (supervisorId) => {
  if (!supervisorId) throw new Error("يجب تمرير معرّف المشرف supervisorId.");
  try {
    const res = await axiosInstance.get(
      apiEndpoints.getParentStudentLocation(supervisorId)
    );
    return res.data; 
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
