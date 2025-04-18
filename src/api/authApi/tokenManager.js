const TOKEN_KEY = "authToken";  

export const getToken = () => localStorage.getItem(TOKEN_KEY);  

export const setToken = (token) => {
  console.log("Storing Token:", token);  
  localStorage.setItem(TOKEN_KEY, token);  
};

export const clearToken = () => {
  console.log("Clearing Token");
  localStorage.removeItem(TOKEN_KEY); 
};
