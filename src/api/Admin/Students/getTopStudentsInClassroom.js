// src/api/Admin/Students/getTopStudentsByLevel.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getTopStudentsByLevel = async (levelId) => {
  const path = apiEndpoints.topStudentsByLevel
    ? apiEndpoints.topStudentsByLevel(levelId)
    : `${apiEndpoints.getAdminTopStudents || "/admin/students/top-students"}?level_id=${levelId}`;

  const res = await axiosInstance.get(path);
  return res.data?.topStudents ?? res.data?.data ?? [];
};
