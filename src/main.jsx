import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginScreen from "./components/LoginScreen.jsx";
import SignUpScreen from "./components/SignUpScreen.jsx"

const router = createBrowserRouter([
  {path:"/", element: <LoginScreen />},
  {path:"/SignUp", element: <SignUpScreen />}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
