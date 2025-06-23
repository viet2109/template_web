import {useSelector} from "react-redux";
import {Route, BrowserRouter as Router, Routes} from "react-router";
import PrivateRoute from "./components/PrivateRoute";
import {privateRoutes, publicRoutes} from "./routes";
import {RootState} from "./store/store";
import {GoogleOAuthProvider} from '@react-oauth/google';

function App() {
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <GoogleOAuthProvider clientId="463484132522-vk4cgi6givdul7ibu9kb3o7r4aap5qd4.apps.googleusercontent.com">
            <Router>
                <Routes>
                    {publicRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                route.layout ? (
                                    <route.layout>
                                        <route.page/>
                                    </route.layout>
                                ) : (
                                    <route.page/>
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
                                            <route.page/>
                                        </route.layout>
                                    ) : (
                                        <route.page/>
                                    )}
                                </PrivateRoute>
                            }
                        ></Route>
                    ))}

                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
