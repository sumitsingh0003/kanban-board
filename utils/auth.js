export const setToken = (token)=>{
  const expiry = Date.now() + 24 * 60 * 60 * 1000;
  localStorage.setItem("token",token);
  localStorage.setItem("token_expiry",expiry.toString());
  document.cookie = `token=${token}; path=/; max-age=86400`;
};

export const getToken = ()=>{
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");
  if(!token || !expiry) return null;
  if(Date.now() > Number(expiry)){
    logout();
    return null;
  }
  return token;
};

export const logout = ()=>{
  const token = localStorage.getItem("token");
  localStorage.removeItem("token");
  localStorage.removeItem("token_expiry");
  document.cookie = `token=${token}; path=/; max-age=86400`;
};