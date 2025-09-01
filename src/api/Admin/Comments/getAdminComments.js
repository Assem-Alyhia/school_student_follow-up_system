// src/api/Admin/Comments/getAdminComments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAdminComments = async ({
  student_id,
  page = 1,
  perPage = 10,
}) => {
  const params = {
    student_id: Number(student_id),
    page,
    per_page: perPage,
  };
  const res = await axiosInstance.get(apiEndpoints.getAdminComments(), {
    params,
  });
  if (res.status !== 200) throw new Error("فشل في جلب التعليقات");
  return res.data;
};
