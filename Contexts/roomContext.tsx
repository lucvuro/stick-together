import React, { createContext, ReactNode, useState } from 'react';
export interface RoomContext {
  currentRoom: CurrentRoom | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<CurrentRoom | null>>;
  setRoom: (room: CurrentRoom | null, setDialog: React.Dispatch<React.SetStateAction<boolean>>) => void;
  listMessage: Message[];
  listMember: Member[]
  setListMessage: React.Dispatch<React.SetStateAction<Message[]>>;
  setListMember: React.Dispatch<React.SetStateAction<Member[]>>;
}
export interface CurrentRoom {
  roomId: string | null;
  owner: string | undefined;
  createdAt: string;
  members: Object;
  chats: Object;
}
export interface Member {
  uid: string | undefined;
  email: string | undefined | null;
  photoUrl: string | undefined | null;
  isOnline: boolean;
}
export interface Message {
  content: string;
  sender: Member;
  mid: string;
}
const RoomContext = createContext<RoomContext>({
  currentRoom: null,
  setCurrentRoom: () => {},
  setRoom: () => {},
  listMessage: [],
  listMember: [],
  setListMessage: () => {},
  setListMember: () => {}
});
const { Provider } = RoomContext;
const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | null>(null);
  const [listMessage, setListMessage] = useState<Message[]>([]);
  const [listMember, setListMember] = useState<Member[]>([])
  const setRoom = (room: CurrentRoom | null, setDialog: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (room) {
      setCurrentRoom(room);
      if (
        (room.chats)
      ) {
        //If have chats on server but chats on client is empty
        //Or have chats on server but not have room
        const messages = Object.values(room.chats)
        setListMessage(messages);
      }
      if (room.members){
        setListMember(Object.values(room.members))
      }
      // addMemberToRoom(room.roomId, currentUser)
    } else {
      setDialog(true)
      setCurrentRoom(null);
    }
  }
  return (
    <Provider
      value={{
        currentRoom,
        setCurrentRoom,
        setRoom,
        listMessage,
        listMember,
        setListMessage,
        setListMember
      }}
    >
      {children}
    </Provider>
  );
};

export { RoomContext, RoomProvider };
