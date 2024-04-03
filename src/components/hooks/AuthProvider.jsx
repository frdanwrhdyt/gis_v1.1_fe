import { useState, createContext, useMemo } from "react";

const AuthContext = createContext({})

export function AuthProvider({children}){
    const [auth, setAuth] = useState({})
    const [persist, setPersist] = useState(localStorage.getItem('persist')||false)
    const userAuthValue = useMemo(()=>({
        auth, setAuth, persist, setPersist
    }),[auth, setAuth, persist, setPersist])
    return (
        <AuthContext.Provider value={userAuthValue}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContext