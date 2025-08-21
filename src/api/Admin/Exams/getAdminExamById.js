// api/Admin/Exams/getAdminExamById.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const getAdminExamById = async (id) => {
  try {
    const url = `${apiEndpoints.getAdminExams}/${id}`;
    const res = await axiosInstance.get(url);
    if (res.status !== 200) throw new Error("فشل في جلب بيانات الامتحان");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب بيانات الامتحان"
    );
  }
};
