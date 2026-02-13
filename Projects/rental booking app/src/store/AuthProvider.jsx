import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export default function AuthProvider({children}){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const raw = localStorage.getItem('rb:user')
    if(raw) setUser(JSON.parse(raw))
  },[])

  function login(u){
    setUser(u)
    localStorage.setItem('rb:user', JSON.stringify(u))
  }

  function logout(){
    setUser(null)
    localStorage.removeItem('rb:user')
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){ return useContext(AuthContext) }
