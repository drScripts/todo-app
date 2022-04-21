import { createContext, useReducer, useEffect } from "react";
import { setToken, getToken, removeToken } from "../storage";
import { baseApiUrl } from "../constant";
import { setAuth } from "../services";

export const UserContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLogin: false,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "USER_SUCCESS_LOGIN":
      setToken(payload?.token);
      setAuth(payload?.token);

      return {
        ...state,
        user: payload?.user,
        isLogin: true,
        token: payload?.token,
      };
    case "USER_FAILED_LOGIN":
      removeToken();
      setAuth(null);
      return {
        ...state,
        user: null,
        token: null,
        isLogin: false,
      };
    case "USER_UPDATE_PROFILE":
      return {
        ...state,
        user: payload?.user,
      };
    case "USER_LOGOUT":
      removeToken();
      setAuth(null);
      return {
        user: null,
        token: null,
        isLogin: false,
      };
    default:
      break;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserProfile = async (token) => {
    await fetch(`${baseApiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        const { status, data } = responseData;
        if (status === "success") {
          dispatch({
            type: "USER_SUCCESS_LOGIN",
            payload: {
              user: data?.user,
              token,
            },
          });
        }
      })
      .catch(() => {
        dispatch({
          type: "USER_FAILED_LOGIN",
        });
      });
  };

  useEffect(async () => {
    const savedToken = await getToken();
    setAuth(savedToken);
    if (savedToken) {
      await getUserProfile(savedToken);
    }
  }, []);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
