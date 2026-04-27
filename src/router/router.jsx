import {createHashRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import ExpressGame from "../pages/ExpressGame/ExpressGame";
import TypeGamePage from "../pages/TypeGame/TypeGame";
import FlashGame from "../pages/FlashGame/FlashGame.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Account from "../pages/Account/Account.jsx";

const router = createHashRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <NotFound/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/game",
                element: <FlashGame/>,
            },
            {
                path: "/express",
                element: <ExpressGame/>,
            },
            {
                path: "/typing",
                element: <TypeGamePage/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/register",
                element: <Register/>,
            },
            {
                path: "/compte",
                element: <Account/>,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound/>,
    },
], {
    // Uses Vite's base path so routing works in local dev and on GitHub Pages.
    basename: import.meta.env.BASE_URL,
});

export default router;
