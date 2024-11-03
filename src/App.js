import React from "react"
import { useAuthContext } from "contexts/AuthContext";
import Routes from "./pages/Routes"
import ScreenLoader from "components/ScreenLoader";

import './App.scss';
import "bootstrap/dist/js/bootstrap.bundle";

function App() {
  const { isAppLoading } = useAuthContext()
  return (
    <>
      {!isAppLoading
        ? <Routes />
        : <ScreenLoader />
      }
    </>
  );
}

export default App;
