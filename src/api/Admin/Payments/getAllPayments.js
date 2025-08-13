// getAllPayments.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

/**
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.perPage
 * @param {string} [params.search]  
 * @param {string|number} [params.classroomId] 
 * @param {string} [params.status]  
 */
export const getAllPayments = async ({
  page = 1,
  perPage = 10,
  search = "",
  classroomId,
  status,
} = {}) => {
  const q = new URLSearchParams();
  q.set("page", page);
  q.set("per_page", perPage);
  if (search) q.set("search", search);
  if (classroomId) q.set("classroom_id", classroomId);
  if (status) q.set("status", status);

  const response = await axiosInstance.get(
    `${apiEndpoints.getAllPayments}?${q.toString()}`
  );
  return response.data;
};
