export const sessionModel = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token: string) => localStorage.setItem("token", token),
  clearToken: () => localStorage.removeItem("token"),
  isAuthenticated: () => Boolean(localStorage.getItem("token")),
};
