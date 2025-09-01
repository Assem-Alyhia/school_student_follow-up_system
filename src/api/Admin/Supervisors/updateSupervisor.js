// src/api/Admin/Supervisors/updateSupervisor.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const updateSupervisor = async (id, fields = {}) => {
  if (!id) throw new Error("المعرف مطلوب");

  const data = new FormData();
  data.append("_method", "PUT");

  Object.entries(fields || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => data.append(`${key}[]`, v));
      return;
    }

    if (key === "image") {
      if (value instanceof File && value.type?.startsWith("image/")) {
        data.append("image", value, value.name);
      }
      return;
    }

    data.append(key, value);
  });

  const response = await axiosInstance.post(
    apiEndpoints.updateSupervisor(id),
    data,
    {
      // اترك المتصفح يضع الـ boundary
      transformRequest: [
        (body, headers) => {
          delete headers.post?.["Content-Type"];
          delete headers.common?.["Content-Type"];
          delete headers["Content-Type"];
          return body;
        },
      ],
    }
  );

  return response.data;
};
