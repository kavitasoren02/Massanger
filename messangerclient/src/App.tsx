import "./App.css";
import { Bounce, ToastContainer } from "react-toastify";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/forgopassword/ForgotPassword";
import ResetPassword from "./pages/resetpassword/ResetPassword";
import Chat from "./pages/chats/Chat";
import { ChatContextProvider } from "./pages/chats/context/ChatContextProvider";
import ProtectedRoutes from "./ProtectedRoute/ProtectedRoute";
import NoAuthRoute from "./ProtectedRoute/NoAuth";
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        <Route 
          path="/register" 
          element={
            <NoAuthRoute>
              <Signup />
            </NoAuthRoute>
          }
        ></Route>

        <Route 
          path="/login" 
          element={
            <NoAuthRoute>
              <Login />
            </NoAuthRoute>
          }
        ></Route>
        <Route 
          path="/forgotpassword" 
          element={
              <NoAuthRoute>
                <ForgotPassword />
              </NoAuthRoute>
            }
          ></Route>
        <Route
          path="/reset-password/:token"
          element={
            <NoAuthRoute>
              <ResetPassword />
            </NoAuthRoute>
          }
        ></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoutes>
              <ChatContextProvider>
                <Chat />
              </ChatContextProvider>
            </ProtectedRoutes>
          }
        ></Route>

        <Route path="*" element={<Navigate to={"/chat"} />}></Route>
      </Routes>
    </>
  );
}

export default App;
