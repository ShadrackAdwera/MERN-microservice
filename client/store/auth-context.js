import { createContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userId: null,
  email: "",
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((authPayload) => {
    setToken(authPayload.token);
    setEmail(authPayload.email);
    setUserId(authPayload.id);
    localStorage.setItem("authPayload", JSON.stringify(authPayload));
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setEmail("");
    localStorage.removeItem("authPayload");
  }, []);

  useEffect(() => {
    const authPayload = JSON.parse(localStorage.getItem("authPayload"));
    if (authPayload && authPayload.token) {
      login(authPayload);
    } else {
      logout();
    }
  }, [logout, login]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, email, token, userId, login, logout }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
