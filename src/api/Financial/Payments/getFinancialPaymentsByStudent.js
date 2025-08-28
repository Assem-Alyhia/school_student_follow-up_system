// src/api/Financial/Payments/getFinancialPaymentsByStudent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getFinancialPaymentsByStudent = async (studentId) => {
  try {
    if (!studentId) throw new Error("يجب تمرير معرّف الطالب");
    const res = await axiosInstance.get(apiEndpoints.finGetPaymentsByStudent(studentId));
    if (res.status !== 200) throw new Error("فشل في جلب مدفوعات الطالب (مالي)");
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب مدفوعات الطالب (مالي)"
    );
  }
};
