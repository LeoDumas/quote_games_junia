import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import FlashGame from "../pages/FlashGame/FlashGame";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import ExpressGame from "../pages/ExpressGame/ExpressGame";

const router = createBrowserRouter([
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
        ],
    },
    {
        path: "*",
        element: <NotFound/>,
    },
]);

export default router;
