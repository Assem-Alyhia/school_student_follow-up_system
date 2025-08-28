// api/Admin/ExamTypes/deleteExamType.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const deleteExamType = async (id) => {
  try {
    const url = apiEndpoints.deleteExamType(id);
    const res = await axiosInstance.delete(url);
    if (res.status !== 200) throw new Error("فشل في حذف نوع الامتحان");
    return res.data; // رسالة نجاح
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف نوع الامتحان"
    );
  }
};
