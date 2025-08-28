// api/Admin/Exams/deleteAdminExam.js
import apiEndpoints from "../../apiEndpoints";
import axiosInstance from "../../axiosInstance";

export const deleteAdminExam = async (id) => {
  try {
    const url = `${apiEndpoints.getAdminExams}/${id}`;
    const res = await axiosInstance.delete(url);
    if (res.status !== 200) throw new Error("فشل في حذف الامتحان");
    return res.data; 
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء حذف الامتحان"
    );
  }
};
