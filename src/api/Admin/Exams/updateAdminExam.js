// api/Admin/Exams/updateAdminExam.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const updateAdminExam = async (id, payload) => {
  try {
    const url = `${apiEndpoints.getAdminExams}/${id}`;
    const res = await axiosInstance.put(url, payload);
    if (res.status !== 200) throw new Error("فشل في تحديث بيانات الامتحان");
    return res.data; // الكائن بعد التحديث أو رسالة نجاح
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء تحديث بيانات الامتحان"
    );
  }
};
