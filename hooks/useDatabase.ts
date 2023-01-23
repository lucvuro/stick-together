import { CurrentRoom, Member, Message, RoomContext } from '@/Contexts/roomContext';
import { database } from '@/firebase';
import { User, UserCredential } from 'firebase/auth';
import { set, ref, push, child, update, get, remove, onChildAdded } from 'firebase/database';
import { Router, useRouter } from 'next/router';
import { useContext, useState } from 'react';
import useAuth from './useAuth';
const useDatabase = () => {
  const { authContext } = useAuth();
  const roomContext = useContext(RoomContext);
  const { currentRoom } = roomContext;
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(true);
  const [loadingLeave, setLoadingLeave] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const router = useRouter();
  const addUser = async (userCredential: UserCredential) => {
    try {
      await set(ref(database, 'users/' + userCredential.user.uid), {
        email: userCredential.user.email,
        roomId: '',
      });
    } catch (err) {
      console.log(err);
    }
  };
  const createRoom = async () => {
    setLoadingCreate(true);
    const newRoomKey = push(child(ref(database), 'rooms')).key;
    const member: Member = {
      uid: authContext.currentUser?.uid,
      email: authContext.currentUser?.email,
      photoUrl: authContext.currentUser?.photoURL,
    };
    const currentRoom: CurrentRoom = {
      roomId: newRoomKey,
      members: [member],
      owner: authContext.currentUser?.uid,
      createdAt: new Date().toUTCString(),
    };
    try {
      await set(ref(database, 'rooms/' + newRoomKey), currentRoom);
      await update(ref(database, 'users/' + authContext.currentUser?.uid), {
        roomId: newRoomKey,
      });
      router.push(`/room/${newRoomKey}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCreate(false);
    }
  };
  const getRoomFromUser = async (userCredential: User) => {
    try {
      const snapshot = await get(
        child(ref(database), 'users/' + userCredential.uid)
      );
      if (snapshot.exists()) {
        const valueSnap = snapshot.val(); //get roomId from user
        if (valueSnap.roomId !== '') {
          const roomFromDB = await get(
            child(ref(database), 'rooms/' + valueSnap.roomId) //get room from DB with roomId(user)
          );
          roomContext.setCurrentRoom(roomFromDB.val());
        }
      } else {
        roomContext.setCurrentRoom(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRoom(false);
    }
  };
  const leaveRoomFromUser = async (
    currentUser: User,
    currentRoom: CurrentRoom
  ) => {
    setLoadingLeave(true);
    try {
      await update(ref(database, 'users/' + currentUser.uid), {
        roomId: '',
      });
      roomContext.setCurrentRoom(null);
      const roomFromDB = await get(
        child(ref(database), 'rooms/' + currentRoom.roomId)
      );
      if (roomFromDB.exists()) {
        const room: CurrentRoom = roomFromDB.val();
        if (room.owner === currentUser.uid) {
          await remove(ref(database, 'rooms/' + currentRoom.roomId));
        } else {
          const members: Member[] | undefined = room.members?.filter(
            (member: Member) => member.uid !== currentUser.uid
          );
          await update(ref(database, 'rooms/' + currentRoom.roomId), {
            members: members,
          });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLeave(false);
    }
  };
  const addUserToRoom = async (currentUser: User, currentRoom: CurrentRoom) => {
    setLoadingAdd(true)
    try {
      const roomFromDB = await get(
        child(ref(database), 'rooms/' + currentRoom.roomId)
      );
      if (roomFromDB.exists()) {
        const room: CurrentRoom = roomFromDB.val();
        const member: Member = {
          uid: currentUser.uid,
          email: currentUser.email,
          photoUrl: currentUser.photoURL,
        };
        const members: Member[] | null = room.members;
        members?.push(member);
        await update(ref(database, 'rooms/' + currentRoom.roomId), {
          members: members,
        });
        await update(ref(database, 'users/' + currentUser.uid), {
          roomId: currentRoom.roomId,
        });
      }
    } catch (err) {
      console.log(err)
    } finally{
      setLoadingAdd(false)
    }
  };
  const addChatToRoom = async (currentRoom: CurrentRoom, message: Message) => {
    setLoadingAdd(true)
    try {
      const roomFromDB = await get(
        child(ref(database), 'rooms/' + currentRoom.roomId)
      );
      if (roomFromDB.exists()) {
        const newChatKey = push(child(ref(database), 'rooms/' + currentRoom.roomId + '/chats')).key;
        await set(ref(database, 'rooms/' + currentRoom.roomId + '/chats/' + newChatKey), {...message, mid: newChatKey});
      }
    } catch (err) {
      console.log(err)
    } finally{
      setLoadingAdd(false)
    }
  };
  return {
    database,
    addUser,
    createRoom,
    getRoomFromUser,
    leaveRoomFromUser,
    addUserToRoom,
    addChatToRoom,
    loadingCreate,
    loadingRoom,
    loadingLeave,
    loadingAdd
  };
};
export default useDatabase;
