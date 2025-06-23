import { useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import { privateRoutes, publicRoutes } from "./routes";
import { RootState } from "./store/store";
function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <Router>
        <Routes>
          {publicRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                route.layout ? (
                  <route.layout>
                    <route.page />
                  </route.layout>
                ) : (
                  <route.page />
                )
              }
            ></Route>
          ))}
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <PrivateRoute isAuth={!!user}>
                  {route.layout ? (
                    <route.layout>
                      <route.page />
                    </route.layout>
                  ) : (
                    <route.page />
                  )}
                </PrivateRoute>
              }
            ></Route>
          ))}
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
