// api/Admin/Students/getStudentsGradesReports.js
import axiosInstance from "../../axiosInstance";
import apiEndpoints from "../../apiEndpoints";

export const getStudentsGradesReports = async (
  levelId = "",
  page = 1,
  perPage = 10,
  search = ""
) => {
  const params = { page, per_page: perPage };
  if (levelId !== "") params.level_id = Number(levelId);

  const s = (search || "").trim();
  if (s) {
    params.search = s;
    params.name = s;
    params.q = s;
    params.keyword = s;
    params["filter[name]"] = s; 
  }

  const res = await axiosInstance.get(apiEndpoints.getStudentsGradesReports, {
    params,
  });
  return res.data; 
};
