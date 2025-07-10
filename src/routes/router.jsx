import { createBrowserRouter, RouterProvider } from "react-router";
import PageNotFound from "../pages/Error/PageNotFound";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import AllScholarship from "../pages/Scholarships/AllScholarships";
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
      {
        path:'/all-scholarships',
        element:<AllScholarship/>
      }
    ]
  },
]);