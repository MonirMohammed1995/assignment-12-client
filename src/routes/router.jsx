import { createBrowserRouter, RouterProvider } from "react-router";
import PageNotFound from "../pages/Error/PageNotFound";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import AllScholarship from "../pages/Scholarships/AllScholarships";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
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
      },
    ]
  },
  {
    path:'/',
    element:<AuthLayout/>,
    children:[
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'register',
        element:<Register/>
      }
    ]
  }
]);