export const getUser = () => {
  const userStr = sessionStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

// return the token from the session storage
export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};

// return the token from the session storage
export const getRole = () => {
  return sessionStorage.getItem("role") || null;
};

// return the token from the session storage
export const getUserId = () => {
  return sessionStorage.getItem("userId") || null;
};
export const getUserName = () => {
  return sessionStorage.getItem("username") || null;
};
// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("userId");
};

// set the token and user from the session storage
export const setUserSession = (token, userId, username, role) => {
  console.log("Setting user session Token :", token);
  console.log("Setting user session userId :", userId);
  console.log("Setting user session role :", role);
  console.log("Setting user session username :", username);
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("userId", userId);
};
