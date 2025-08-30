// src/api/Supervisor/Students/updateStudent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateSupervisorStudent = async (studentId, payload) => {
  const res = await axiosInstance.put(
    apiEndpoints.updateSupervisorStudent(studentId),
    payload
  );
  if (res.status !== 200) throw new Error("فشل في تحديث الطالب");
  return res.data;
};
