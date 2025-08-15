// api/Admin/Classrooms/updateClassroom.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateClassroom = async (id, payload) => {
  try {
    const body = {
      level_id: Number(payload.level_id),
      name: String(payload.name || "").trim(),
      capacity: Number(payload.capacity),
      status: payload.status || "active",
    };
    const res = await axiosInstance.put(apiEndpoints.updateClassroom(id), body);
    return res.data?.data ?? res.data;
  } catch (error) {
    const e = new Error(error?.response?.data?.message || "فشل في تعديل الصف");
    e.details = error?.response?.data?.errors || {};
    throw e;
  }
};
