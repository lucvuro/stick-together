import React, { createContext, ReactNode, useState } from 'react';
export interface UserContextType {
  currentUserApp: UserApp | null;
  setCurrentUserApp: React.Dispatch<React.SetStateAction<UserApp | null>>;

}
export interface UserApp {
    uid: string;
    email: string | null;
    photoUrl: string | null;
    isOnline: boolean;
    roomId: string;
}
const UserContext = createContext<UserContextType>({
  currentUserApp: null,
  setCurrentUserApp: () => {},

});
const { Provider } = UserContext;
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserApp, setCurrentUserApp] = useState<UserApp | null>(null);
  return (
    <Provider
      value={{ currentUserApp, setCurrentUserApp}}
    >
      {children}
    </Provider>
  );
};

export { UserContext, UserProvider };
