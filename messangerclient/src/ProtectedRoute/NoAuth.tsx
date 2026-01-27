import type { NoAuthRouteProps } from "../Service/interface";
import { useAuth } from "./AuthProvider";
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/ui/Loader';

export default function NoAuthRoute ({ children }: NoAuthRouteProps) {
    const { user } = useAuth();
    const { pathname } = useLocation();

    if( user === undefined){
        return <Loader/>
    }

    if( user !== null && pathname !== "/"){
        return <Navigate to="/" replace />
    }
    return children;
}
