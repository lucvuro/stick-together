import {
  CurrentRoom,
  Member,
  Message,
  RoomContext,
} from '@/Contexts/roomContext';
import { UserApp } from '@/Contexts/userContext';
import { database } from '@/firebase';
import { onAuthStateChanged, User, UserCredential } from 'firebase/auth';
import {
  set,
  ref,
  push,
  child,
  update,
  get,
  remove,
  onChildAdded,
  DataSnapshot,
  onValue,
} from 'firebase/database';
import { Router, useRouter } from 'next/router';
import { useContext, useState } from 'react';
import useAuth from './useAuth';
import useRoom from './useRoom';
import useUser from './useUser';
const useDatabase = () => {
  const roomContext = useContext(RoomContext);
  const { currentUserApp, setCurrentUserApp } = useUser();
  const { setRoom } = useRoom();
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(true);
  const [loadingLeave, setLoadingLeave] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const router = useRouter();
  const createUser = async (userCredential: UserCredential) => {
    try {
      await set(ref(database, 'users/' + userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        photoUrl: '',
        isOnline: false,
        roomId: '',
      });
    } catch (err) {
      console.log(err);
    }
  };
  const getUserAndSetUserApp = async (userId: string) => {
    try {
      const snapshot: DataSnapshot = await get(
        child(ref(database), 'users/' + userId)
      );
      const user: UserApp = snapshot.val();
      setCurrentUserApp(user);
    } catch (err) {
      console.log(err);
      setCurrentUserApp(null);
    }
  };
  //---Rooms
  const getRoomAndSetRoom = async (roomId: string, callback: any) => {
    try {
      const snapshot: DataSnapshot = await get(
        child(ref(database), 'rooms/' + roomId)
      );
      const roomResult: CurrentRoom = snapshot.val();
      setRoom(roomResult, callback);
    } catch (err) {
      console.log(err);
    }
  };
  const createRoom = async (currentUserApp: UserApp) => {
    setLoadingCreate(true);
    const newRoomKey = push(child(ref(database), 'rooms')).key;
    const currentRoom: CurrentRoom = {
      roomId: newRoomKey,
      owner: currentUserApp.uid,
      createdAt: new Date().toUTCString(),
      chats: {},
      members: {},
    };
    // roomContext.setCurrentRoom(currentRoom);

    try {
      await set(ref(database, 'rooms/' + newRoomKey), currentRoom);
      await update(ref(database, 'users/' + currentUserApp.uid), {
        roomId: newRoomKey,
      });
      await addMemberToRoom(newRoomKey, currentUserApp);
      await fetch(
        `${process.env.NEXT_PUBLIC_APILINK}/stream/${newRoomKey}/init`
      );
      router.push(`/room/${newRoomKey}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCreate(false);
      setCurrentUserApp({
        ...currentUserApp,
        roomId: newRoomKey || '',
      });
    }
  };
  const getRoomFromUser = async (roomId: string) => {
    try {
      if (roomId) {
        const roomFromDB = await get(
          child(ref(database), 'rooms/' + roomId) //get room from DB with roomId(user)
        );
        roomContext.setCurrentRoom(roomFromDB.val());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRoom(false);
    }
  };
  const leaveRoomFromUser = async (
    currentUserApp: UserApp,
    currentRoom: CurrentRoom
  ) => {
    setLoadingLeave(true);
    try {
      await update(ref(database, 'users/' + currentUserApp.uid), {
        roomId: '',
      });
      const roomFromDB = await get(
        child(ref(database), 'rooms/' + currentRoom.roomId)
      );
      if (roomFromDB.exists()) {
        const room: CurrentRoom = roomFromDB.val();
        if (room.owner === currentUserApp.uid) {
          await remove(ref(database, 'rooms/' + currentRoom.roomId));
        } else {
          await remove(
            ref(
              database,
              'rooms/' + currentRoom.roomId + '/members/' + currentUserApp.uid
            )
          );
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLeave(false);
      roomContext.setCurrentRoom(null);
    }
  };
  const addMemberToRoom = async (
    roomId: string | null,
    currentUserApp: UserApp | null
  ) => {
    if (roomId && currentUserApp) {
      const member: Member = {
        uid: currentUserApp.uid,
        email: currentUserApp.email,
        photoUrl: '',
        isOnline: currentUserApp.isOnline,
      };
      try {
        await update(ref(database, 'users/' + currentUserApp.uid), {
          roomId: roomId,
        });
        await set(
          ref(database, 'rooms/' + roomId + '/members/' + currentUserApp.uid),
          member
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  const setStatusMember = async (
    roomId: string | null,
    userId: string | null,
    online: boolean
  ) => {
    if (roomId && userId) {
      try {
        await update(ref(database, 'rooms/' + roomId + '/members/' + userId), {
          isOnline: online,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const addChatToRoom = async (currentRoom: CurrentRoom, message: Message) => {
    setLoadingAdd(true);
    try {
      const roomFromDB = await get(
        child(ref(database), 'rooms/' + currentRoom.roomId)
      );
      if (roomFromDB.exists()) {
        const newChatKey = push(
          child(ref(database), 'rooms/' + currentRoom.roomId + '/chats')
        ).key;
        await set(
          ref(database, 'rooms/' + currentRoom.roomId + '/chats/' + newChatKey),
          { ...message, mid: newChatKey }
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAdd(false);
    }
  };
  const setPeerIdToMember = async (
    roomId: string | null,
    userId: string | null,
    peerId: string
  ) => {
    if (roomId && userId) {
      try {
        await update(ref(database, 'rooms/' + roomId + '/members/' + userId), {
          peerId: peerId,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };
  //---Rooms

  //--Custom firebase
  const onValueCustom = (path: string, callback: any) => {
    return onValue(ref(database, path), (snapshot: DataSnapshot) => {
      callback(snapshot.val());
    });
  };
  //--Custom firebase
  return {
    database,
    createUser,
    getUserAndSetUserApp,
    createRoom,
    getRoomAndSetRoom,
    getRoomFromUser,
    leaveRoomFromUser,
    // addUserToRoom,
    addChatToRoom,
    addMemberToRoom,
    onValueCustom,
    setStatusMember,
    setPeerIdToMember,
    loadingCreate,
    loadingRoom,
    loadingLeave,
    loadingAdd,
  };
};
export default useDatabase;
