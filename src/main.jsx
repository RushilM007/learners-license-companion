import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LoginScreen from "./components/LoginScreen.jsx";
import SignUpScreen from "./components/SignUpScreen.jsx"
import HomeScreen from "./components/HomeScreen.jsx"
import ForgotPasswordScreen from "./components/ForgotPasswordScreen.jsx"
import Questionbank from './components/Questionbank.jsx'
import Chatbot from './components/Chatbot.jsx'
import MockExam from './components/MockExam.jsx';
import Settings from './components/Settings.jsx';
import Credits from './components/Credits.jsx';
import ChangeEmail from './components/ChangeEmail.jsx';

const router = createBrowserRouter([
  {path:"/", element: <LoginScreen />},
  {path:"/SignUp", element: <SignUpScreen />},
  {path:"/HomeScreen", element: <HomeScreen />},
  {path:"/ForgotPassword", element: <ForgotPasswordScreen />},
  {path:"/Questionbank", element: <Questionbank />},
  {path:"/Chatbot", element: <Chatbot />},
  {path:"/MockExam", element: <MockExam />},
  {path: "/Settings", element: <Settings />},
  {path: "/Credits", element: <Credits />},
  {path: "/ChangeEmail", element: <ChangeEmail />}

])

createRoot(document.getElementById('root')).render(
    <RouterProvider router = {router} />
)
