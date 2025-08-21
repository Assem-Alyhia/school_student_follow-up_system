// api/Admin/ExamTypes/getAllExamTypesNoPaginate.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getAllExamTypesNoPaginate = async () => {
  try {
    const res = await axiosInstance.get(apiEndpoints.getAllExamTypesNoPaginate);
    if (res.status !== 200) throw new Error("فشل في جلب جميع أنواع الامتحانات");
    return res.data; // { data: [...] }
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب جميع أنواع الامتحانات"
    );
  }
};
