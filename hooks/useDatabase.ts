import { database } from '@/firebase';
import { User, UserCredential } from 'firebase/auth';
import { set, ref, push, child, update, get } from 'firebase/database';
import { Router, useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from './useAuth';
const useDatabase = () => {
  const { authContext } = useAuth();
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(true)
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
    try {
      await set(ref(database, 'rooms/' + newRoomKey), {
        owner: authContext.currentUser?.uid,
        members: [],
        created_at: new Date().toUTCString(),
      });
      await update(ref(database, 'users/' + authContext.currentUser?.uid), {
        roomId: newRoomKey,
      });
      router.push(`/room/${newRoomKey}`)
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
        const valueSnap = snapshot.val();
        authContext.setCurrentRoom(valueSnap.roomId);
      } else {
        authContext.setCurrentRoom('');
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRoom(false)
    }
  };
  return {
    database,
    addUser,
    createRoom,
    getRoomFromUser,
    loadingCreate,
    loadingRoom
  };
};
export default useDatabase;
