import { RoomContext } from '@/Contexts/roomContext';
import { useContext } from 'react';

const useRoom = () => {
  const roomContext = useContext(RoomContext);
  const {
    currentRoom,
    setCurrentRoom,
    setRoom,
    listMessage,
    setListMessage,
    listMember,
    setListMember,
    mediaStream,
    setMediaStream,
    setAudiosFromPeer,
    muteAllAudio,
  } = roomContext;
  return {
    currentRoom,
    setCurrentRoom,
    setRoom,
    listMessage,
    setListMessage,
    listMember,
    setListMember,
    mediaStream,
    setMediaStream,
    setAudiosFromPeer,
    muteAllAudio,
  };
};
export default useRoom;
