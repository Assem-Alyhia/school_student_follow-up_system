// src/api/Admin/Comments/getAdminComments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAdminComments = async ({ student_id }) => {
  const res = await axiosInstance.get(
    apiEndpoints.getAdminComments(), 
    { params: { student_id: Number(student_id) } }
  );
  if (res.status !== 200) throw new Error("فشل في جلب التعليقات");
  return res.data; 
};
