import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useState } from 'react';
export interface RoomContext {
  currentRoom: CurrentRoom | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<CurrentRoom | null>>;
}
export interface CurrentRoom {
    roomId: string | null;
    owner: string | undefined;
    createdAt: string;
    members: Member[] | null;
}
export interface Member {
    uid: string | undefined;
    email: string | undefined | null;
    photoUrl: string | undefined | null;
}
const RoomContext = createContext<RoomContext>({
  currentRoom: null,
  setCurrentRoom: () => {},
});
const { Provider } = RoomContext;
const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | null>(null);
  return (
    <Provider
      value={{currentRoom, setCurrentRoom }}
    >
      {children}
    </Provider>
  );
};

export { RoomContext, RoomProvider };
