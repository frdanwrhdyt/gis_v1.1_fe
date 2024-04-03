import { useContext, useDebugValue } from "react";
import AuthContext from "./AuthProvider";

export default function useAuth(){
    const {auth} = useContext(AuthContext)
    useDebugValue(auth, (Auth)=>(Auth?.user?'Logged in':'Logged Out'))

    return useContext(AuthContext)
}