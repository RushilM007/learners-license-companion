import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginScreen from "./components/LoginScreen.jsx";
import SignUpScreen from "./components/SignUpScreen.jsx"
import HomeScreen from "./components/HomeScreen.jsx"
import ForgotPasswordScreen from "./components/ForgotPasswordScreen.jsx"

const router = createBrowserRouter([
  {path:"/", element: <LoginScreen />},
  {path:"/SignUp", element: <SignUpScreen />},
  {path:"/HomeScreen", element: <HomeScreen />},
  {path:"/ForgotPassword", element: <ForgotPasswordScreen />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
