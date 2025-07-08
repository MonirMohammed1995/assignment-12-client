import { createBrowserRouter, RouterProvider } from "react-router";
import PageNotFound from "../pages/Error/PageNotFound";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement:<PageNotFound/>,
    children:[
      {
        index:true,
        element:<Home/>
      },
      
    ]
  },
]);