  // src/api/Admin/Subjects/getAllSubjectsNoPaginate.js
  import axiosInstance from "../../axiosInstance";
  import apiEndpoints from "../../apiEndpoints";

  export const getAllSubjectsNoPaginate = async () => {
    const response = await axiosInstance.get(apiEndpoints.getAllSubjectsNoPaginate);
    return response.data.data; 
  };
