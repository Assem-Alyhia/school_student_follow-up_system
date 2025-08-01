import axiosInstance from '../../axiosInstance';
import apiEndpoints from '../../apiEndpoints';

export const createRole = async ({ name, permissions }) => {
  const response = await axiosInstance.post(apiEndpoints.createRole, {
    name,
    permissions, 
  });

  return response.data;
};
