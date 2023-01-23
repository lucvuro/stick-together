import { User } from 'firebase/auth';
import { DataSnapshot } from 'firebase/database';
import React, { createContext, ReactNode, useState } from 'react';
export interface RoomContext {
  currentRoom: CurrentRoom | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<CurrentRoom | null>>;
  listMessage: Message[];
  setListMessage: React.Dispatch<React.SetStateAction<Message[]>>;
}
export interface CurrentRoom {
  roomId: string | null;
  owner: string | undefined;
  createdAt: string;
  members: Member[] | null;
  chats?: Object;
}
export interface Member {
  uid: string | undefined;
  email: string | undefined | null;
  photoUrl: string | undefined | null;
}
export interface Message {
  content: string;
  sender: Member;
  mid: string;
}
const RoomContext = createContext<RoomContext>({
  currentRoom: null,
  setCurrentRoom: () => {},
  listMessage: [],
  setListMessage: () => {},
});
const { Provider } = RoomContext;
const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | null>(null);
  const [listMessage, setListMessage] = useState<Message[]>([]);
  return (
    <Provider
      value={{
        currentRoom,
        setCurrentRoom,
        listMessage,
        setListMessage,
      }}
    >
      {children}
    </Provider>
  );
};

export { RoomContext, RoomProvider };
