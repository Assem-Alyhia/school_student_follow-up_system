// api/Admin/ExamTypes/getExamTypeById.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getExamTypeById = async (id) => {
  try {
    const url = apiEndpoints.getExamTypeById(id);
    const res = await axiosInstance.get(url);
    if (res.status !== 200) throw new Error("فشل في جلب نوع الامتحان");
    return res.data; // { data: {...} }
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب نوع الامتحان"
    );
  }
};
    