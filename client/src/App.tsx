import { PaletteMode, ThemeProvider } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "./api/useAxios";
import GlobalSnackbar from "./components/ui/Snackbar";
import SelectedEmpsContext from "./context/SelectedEmpsContext";
import SnackbarContext from "./context/SnackbarContext";
import UserDataContext from "./context/UserDataContext";
import MainRouter from "./router/MainRouter";
import ProjectTheme from "./style_extensions/ProjectTheme";
import { SnackbarTypes } from "./types/SnackbarTypes";
import { UserTypes } from "./types/UserTypes";
import { registerServiceWorker } from "./serviceWorkerRegistration";

function App() {
  registerServiceWorker();

  const [themeMode] = useState<PaletteMode>("light");
  const [userData, setUserData] = useState<UserTypes>();
  const [selectedEmps, setSelectedEmps] = useState<Array<UserTypes>>([]);
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState<SnackbarTypes>({
    open: false,
    message: "no message",
    severity: "success",
  });

  const isBaseRoute: boolean =
    !location.pathname.includes("admin") &&
    !location.pathname.includes("employee") &&
    !location.pathname.includes("driver");

  useEffect(() => {
    if (!userData) {
      useAxios
        .post("auth/validate-token", {})
        .then((res) => {
          let user: UserTypes = res.data.currentUser;
          setUserData(user);
          // if (res.data.currentUser?.role) {
          isBaseRoute && navigate(`/${res.data.currentUser?.role}`);
          // }
        })
        .catch(() => navigate("/"));
    }
  }, []);

  return (
    <ThemeProvider theme={ProjectTheme(themeMode)}>
      <UserDataContext.Provider value={{ userData, setUserData }}>
        <SelectedEmpsContext.Provider value={{ selectedEmps, setSelectedEmps }}>
          <GlobalSnackbar value={{ openSnack, setOpenSnack }} />
          <SnackbarContext.Provider value={{ openSnack, setOpenSnack }}>
            <MainRouter />
            <ReactQueryDevtools />
          </SnackbarContext.Provider>
        </SelectedEmpsContext.Provider>
      </UserDataContext.Provider>
    </ThemeProvider>
  );
}

export default App;
