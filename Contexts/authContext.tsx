import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useState } from 'react';
export interface AuthContext {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentRoom: string;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
}
const AuthContext = createContext<AuthContext>({
  currentUser: null,
  setCurrentUser: () => {},
  currentRoom: '',
  setCurrentRoom: () => {},
});
const { Provider } = AuthContext;
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  return (
    <Provider
      value={{ currentUser, setCurrentUser, currentRoom, setCurrentRoom }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
