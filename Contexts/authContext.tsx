import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useState } from 'react';
export interface AuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
}
const AuthContext = createContext<AuthContext>({ currentUser: null, setCurrentUser: () => {}});
const { Provider } = AuthContext;
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return <Provider value={{ currentUser, setCurrentUser }}>{children}</Provider>;
};

export { AuthContext, AuthProvider };
