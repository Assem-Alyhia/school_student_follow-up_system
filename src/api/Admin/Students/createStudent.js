// src/api/Admin/Students/createStudent.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const createStudent = async (studentData) => {
  try {
    const formData = new FormData();

    // إضافة كل البيانات المطلوبة
    for (const key in studentData) {
      if (studentData[key] !== null && studentData[key] !== undefined)
        formData.append(key, studentData[key]);
    }

    const response = await axiosInstance.post(
      apiEndpoints.getAllStudents,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },  
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "فشل في إنشاء الطالب"
    );
  }
};
