import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = createContext();

const initialState = { isAuthenticated: false, user: {} };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_LOGGED_IN":
      return { isAuthenticated: true, user: payload.user };
    case "SET_PROFILE":
      return { ...state, user: payload.user };
    case "SET_LOGGED_OUT":
      return initialState;
    default:
      return state;
  }
};

export default function AuthContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAppLoading, setIsAppLoading] = useState(true);

  let navigate = useNavigate();

  const readProfile = useCallback(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "SET_LOGGED_IN", payload: { user } });
      } else {
        console.log("User not found");
      }
    });
    setTimeout(() => {
      setIsAppLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    readProfile();
  }, [readProfile]);

  const handleLogout = () => {
    dispatch({ type: "SET_LOGGED_OUT" });
    navigate("/auth/register")
  };

  return (
    <Auth.Provider
      value={{
        ...state,
        dispatch,
        isAppLoading,
        setIsAppLoading,
        handleLogout,
      }}
    >
      {children}
    </Auth.Provider>
  );
}

export const useAuthContext = () => useContext(Auth);
