import useMe from "@/hooks/auth/useMe";
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "react-use";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

const LOCAL_STORAGE_TOKEN_KEY = "token";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [token, setToken, clearToken] = useLocalStorage(
    LOCAL_STORAGE_TOKEN_KEY,
    null
  );

  const {
    data: loggedInUserData,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useMe(token);

  const _loading = useMemo(() => {
    return loading || isUserProfileLoading;
  }, [loading, isUserProfileLoading]);

  const login = useCallback(
    ({ token, ...user }) => {
      setLoading(true);

      const isNewUser = user?.isNewUser;
      delete user?.isNewUser;
      setUser(user);
      if (token) setToken(token);
      setIsAuthenticated(true);

      setLoading(false);

      if (isNewUser && window.location.pathname !== "/auth/signup") {
        window.location.href = "/auth/signup";
      } else if (window.location.pathname.includes("/auth")) {
        window.location.href = "/";
      }
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setLoading(true);
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, [clearToken]);

  useEffect(() => {
    if (token) {
      if (loggedInUserData) {
        if (loggedInUserData.success && !isAuthenticated) {
          login(loggedInUserData.data);
        } else if (!loggedInUserData.success) {
          logout();
        }
      } else if (isUserProfileError) {
        logout();
      }
    } else {
      logout();
    }
  }, [
    token,
    login,
    logout,
    loggedInUserData,
    isUserProfileError,
    isAuthenticated,
  ]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading: _loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;

export { AuthContext };
