import { useState, useCallback, useMemo } from "react";
import useAxios from "../../hooks/useAxios";
import {
  getUser,
  removeToken,
  setTokenInLocalStorage,
} from "../services/localStorageService";
import { useUser } from "../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routesModel";
import {
  getUserData,
  login,
  signup,
  updateUser,
} from "../services/userApiService";
import normalizeUser from "../helpers/normalization/normalizeUser";
import { useSnack } from "../../providers/SnackBarProvider";

const useUsers = () => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const snack = useSnack();
  const navigate = useNavigate();
  const { user, setUser, setToken } = useUser();

  useAxios();

  const requestStatus = useCallback(
    (loading, errorMessage, user = null) => {
      setLoading(loading);
      setUser(user);
      setError(errorMessage);
    },
    [setUser]
  );

  const handleLogin = useCallback(
    async (user) => {
      try {
        const token = await login(user);
        setTokenInLocalStorage(token);
        setToken(token);
        const userFromLocalStorage = getUser();
        requestStatus(false, null, userFromLocalStorage);
        navigate(ROUTES.CARDS);
      } catch (error) {
        requestStatus(false, error, null);
      }
    },
    [navigate, requestStatus, setToken]
  );

  const handleSignup = useCallback(
    async (userFromTheClient) => {
      try {
        const normalizedUser = normalizeUser(userFromTheClient);
        await signup(normalizedUser);
        await handleLogin({
          email: userFromTheClient.email,
          password: userFromTheClient.password,
        });
      } catch (error) {
        requestStatus(false, error, null);
      }
    },
    [handleLogin, requestStatus]
  );

  const handleGetUser = useCallback(async (id) => {
    try {
      const userData = await getUserData(id);
      setLoading(false);
      setError(null);
      return userData;
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  }, []);

  const handleUpdateUser = useCallback(
    async (updatedUser) => {
      try {
        setLoading(true);
        const user = await updateUser(updatedUser.user_id, updatedUser);
        requestStatus(false, null, user);
        snack("success", "The user has been successfully updated");
      } catch (error) {
        requestStatus(false, error, null);
      }
    },
    [requestStatus, snack]
  );

  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({ isLoading, error, user }),
    [isLoading, error, user]
  );

  return {
    value,
    handleLogin,
    handleLogout,
    handleSignup,
    handleGetUser,
    handleUpdateUser,
  };
};

export default useUsers;
