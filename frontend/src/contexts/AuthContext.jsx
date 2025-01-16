import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()

  //functia de signup, daca nu mai vreau firebase, doar schimb functia
  function signup(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
  }

  //functia de login, daca nu mai vreau firebase, doar schimb functia
  function login(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
    })

    return unsubscribe
  }, [])
  

  const value = {
    currentUser,
    signup,
    login,
    logout
  }

  return (
    <div>
        <AuthContext.Provider value={value}>
            { children }
        </AuthContext.Provider>
    </div>
  )
}
