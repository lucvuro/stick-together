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
  } = roomContext;
  return {
    currentRoom,
    setCurrentRoom,
    setRoom,
    listMessage,
    setListMessage,
    listMember,
    setListMember,
  };
};
export default useRoom;
