import type { ProtectedRouteProps } from "../Service/interface";
import { useAuth } from "./AuthProvider";
import Loader from "../components/ui/Loader";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes ({ children }: ProtectedRouteProps) {
    const { user } = useAuth();

    if( user === undefined) return <Loader/>

    if(user === null){
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}