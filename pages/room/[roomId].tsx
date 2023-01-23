import MainComponent from '@/components/room/MainComponent';
import { CurrentRoom, Member, RoomContext } from '@/Contexts/roomContext';
import { database } from '@/firebase';
import useAuth from '@/hooks/useAuth';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/Room.module.css';
import useDatabase from '@/hooks/useDatabase';
export interface RoomDetailProps {
  currentRoom: CurrentRoom;
}

export default function RoomDetail(props: RoomDetailProps) {
  const { authContext, auth, router } = useAuth();
  const { currentUser } = authContext;
  const { roomId } = router.query;
  const roomContext = useContext(RoomContext);
  const { currentRoom } = roomContext;
  const [open, setOpen] = useState<boolean>(false);
  const { addUserToRoom } = useDatabase();
  const handleOk = () => {
    router.push('/');
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        authContext.setCurrentUser(user);
        // if (!props.currentRoom) {
        //   router.push('/');
        // } else {
        //   roomContext.setCurrentRoom(props.currentRoom);
        // }
      } else {
        authContext.setCurrentUser(null);
        router.push('/login');
      }
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    if (currentUser) {
      const unsub = onValue(ref(database, 'rooms/' + roomId), (snapshot) => {
        const room: CurrentRoom | null = snapshot.val();
        if (room) {
          roomContext.setCurrentRoom(room);
          if (
            (room.chats)
          ) {
            //If have chats on server but chats on client is empty
            //Or have chats on server but not have room
            const messages = Object.values(room.chats)
            roomContext.setListMessage(messages);
          }
          if (
            !room.members?.find(
              (member: Member) => member.uid === currentUser.uid
            )
          ) {
            //Check if the currentUser is not in the room
            addUserToRoom(currentUser, room);
          }
        } else {
          roomContext.setCurrentRoom(null);
          setOpen(true);
        }
      });
      return () => unsub();
    }
  }, [currentUser]);
  return (
    <>
      <Head>
        <title>Room | Stick Together</title>
        <meta name="description" content="Login Stick Together" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {(authContext.currentUser && roomContext.currentRoom) ||
      router.isFallback ? (
        <main>
          <MainComponent currentRoom={currentRoom} currentUser={currentUser} />
        </main>
      ) : (
        <Box sx={{ color: 'text.primary' }} className={styles.roomLoading}>
          <p>Loading room infos....</p>
          <CircularProgress />
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleOk}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'ERROR'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your room not exists on server!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleOk}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export async function getStaticPaths() {
  return {
    paths: [
      { params: { roomId: '1' } }, // See the "paths" section below
    ],
    fallback: true, // See the "fallback" section below
  };
}
export async function getStaticProps(context: GetStaticPropsContext) {
  //   let currentRoom = null;
  //   try {
  //     if (context.params?.roomId) {
  //       const snapshot = await get(
  //         child(ref(database), 'rooms/' + context.params?.roomId)
  //       );
  //       if (snapshot.exists()) {
  //         const value = snapshot.val();
  //         currentRoom = value;
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  return {
    props: {},
  };
}
