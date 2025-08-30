// src/api/Supervisor/Parents/getSupervisorParentById.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";


export const getSupervisorParentById = async (parentId) => {
  try {
    const id = Number(parentId);
    if (!Number.isFinite(id)) throw new Error("parentId غير صالح");
    const res = await axiosInstance.get(apiEndpoints.supervisorParentById(id));
    if (res.status !== 200) throw new Error("فشل في جلب بيانات وليّ الأمر");
    return res.data; 
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        err?.message ||
        "حدث خطأ أثناء جلب بيانات وليّ الأمر"
    );
  }
};
