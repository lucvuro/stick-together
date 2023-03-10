import React, { createContext, ReactNode, useState } from 'react';
import { Song } from './musicboxContext';
export interface RoomContext {
  currentRoom: CurrentRoom | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<CurrentRoom | null>>;
  setRoom: (
    room: CurrentRoom | null,
    setDialog: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  listMessage: Message[];
  listMember: Member[];
  mediaStream: MediaStream | null;
  setListMessage: React.Dispatch<React.SetStateAction<Message[]>>;
  setListMember: React.Dispatch<React.SetStateAction<Member[]>>;
  setMediaStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  setAudiosFromPeer: (audio: HTMLAudioElement) => void;
  muteAllAudio: (mute: boolean) => void;
}
export interface CurrentRoom {
  roomId: string | null;
  owner: string | undefined;
  createdAt: string;
  members: Object;
  chats: Object;
  musicBox?: {
    currentSong: Song;
    playlist: Song[];
  };
}
export interface Member {
  uid: string | undefined;
  email: string | undefined | null;
  photoUrl: string | undefined | null;
  isOnline: boolean;
  peerId?: string;
  nickname?: string;
  about?: string;
  joinDate?: string;
}
export interface Message {
  content: string;
  sender: Member;
  mid: string;
  createdAt: string;
}
const RoomContext = createContext<RoomContext>({
  currentRoom: null,
  setCurrentRoom: () => {},
  setRoom: () => {},
  listMessage: [],
  listMember: [],
  mediaStream: null,
  setListMessage: () => {},
  setListMember: () => {},
  setMediaStream: () => {},
  setAudiosFromPeer: () => {},
  muteAllAudio: () => {},
});
const { Provider } = RoomContext;
const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<CurrentRoom | null>(null);
  const [listMessage, setListMessage] = useState<Message[]>([]);
  const [listMember, setListMember] = useState<Member[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [listAudio, setListAudio] = useState<HTMLAudioElement[]>([]);
  const setRoom = (
    room: CurrentRoom | null,
    setDialog: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (room) {
      setCurrentRoom(room);
      if (room.chats) {
        //If have chats on server but chats on client is empty
        //Or have chats on server but not have room
        const messages = Object.values(room.chats);
        setListMessage(messages);
      }
      if (room.members) {
        setListMember(Object.values(room.members));
      }
      // addMemberToRoom(room.roomId, currentUser)
    } else {
      setDialog(true);
      setCurrentRoom(null);
    }
  };
  const setAudiosFromPeer = (audio: HTMLAudioElement) => {
    setListAudio([...listAudio, audio]);
  };
  const muteAllAudio = (mute: boolean) => {
    listAudio.map((audio: HTMLAudioElement, peer, audios) => {
      audios[peer].muted = mute;
    });
  };
  return (
    <Provider
      value={{
        currentRoom,
        setCurrentRoom,
        setRoom,
        listMessage,
        listMember,
        mediaStream,
        setListMessage,
        setListMember,
        setMediaStream,
        setAudiosFromPeer,
        muteAllAudio,
      }}
    >
      {children}
    </Provider>
  );
};

export { RoomContext, RoomProvider };
