// api/Admin/Classrooms/createClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createClassroom = async ({ level_id, name, capacity, status }) => {
  try {
    const payload = {
      level_id: Number(level_id),
      name: String(name).trim(),
      capacity: Number(capacity),
      status: status || "active",
    };

    const res = await axiosInstance.post(apiEndpoints.createClassroom, payload);
    return res.data?.data ?? res.data;
  } catch (error) {
    const e = new Error(error?.response?.data?.message || "فشل في إنشاء الصف");
    e.details = error?.response?.data?.errors || {};
    throw e;
  }
};
