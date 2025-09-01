// src/api/Admin/SchoolFees/getAllSchoolFees.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getAllSchoolFees = async (
  page = 1,
  perPage = 10,
  extraParams = {}
) => {
  try {
    const response = await axiosInstance.get(apiEndpoints.getAllSchoolFees, {
      params: {
        page,
        per_page: perPage,
        ...(extraParams?.search
          ? {
              search: extraParams.search,
              q: extraParams.search,
              name: extraParams.search,
            }
          : {}),
        ...extraParams,
      },
    });

    if (response.status !== 200) {
      throw new Error("فشل في جلب الرسوم الدراسية");
    }
    return response.data; // {data, meta...}
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء جلب الرسوم الدراسية"
    );
  }
};
