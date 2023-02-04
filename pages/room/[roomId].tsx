import MainComponent from '@/components/room/MainComponent';
import { CurrentRoom, Member, RoomContext } from '@/Contexts/roomContext';
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
  Fab,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Room.module.css';
import useDatabase from '@/hooks/useDatabase';
import useRoom from '@/hooks/useRoom';
import useUser from '@/hooks/useUser';
import LoadingComponent from '@/components/common/LoadingComponent';
interface RoomDetailProps {
  currentRoom: CurrentRoom;
}
export default function RoomDetail(props: RoomDetailProps) {
  const { auth, router } = useAuth();
  const { currentUserApp } = useUser();
  const { roomId } = router.query;
  const { currentRoom } = useRoom();
  const [open, setOpen] = useState<boolean>(false);
  const [openAlreadyRoom, setOpenAlreadyRoom] = useState<boolean>(false);
  const {
    addMemberToRoom,
    setStatusMember,
    getUserAndSetUserApp,
    getRoomAndSetRoom,
    updateMemberToRoom
  } = useDatabase();
  const handleOk = () => {
    router.push('/');
  };
  // function playStream(stream: MediaStream) {
  //   const audio = document.createElement("audio")
  //   audio.src = (URL || webkitURL).createObjectURL(stream);
  //   document.body.appendChild(audio)
  // }
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        //If user have in app before dont need set again
        getUserAndSetUserApp(user);
        if (router.pathname === '/login') {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    if (currentUserApp && !currentRoom) {
      getRoomAndSetRoom(String(roomId), setOpen);
    }
  }, [currentUserApp]);
  useEffect(() => {
    if (currentRoom && currentUserApp) {
      if (
        currentUserApp.roomId &&
        currentRoom.roomId !== currentUserApp.roomId
      ) {
        //Check if user have already another room
        setOpenAlreadyRoom(true);
        return;
      }
      if (!Object.keys(currentRoom.members).includes(currentUserApp.uid)) {
        //If user is not a member in room
        addMemberToRoom(currentRoom.roomId, currentUserApp);
      } else {
        //If user is a member in room set status to online
        //And update member again
        updateMemberToRoom(currentRoom.roomId, currentUserApp)
      }
    }
    window.addEventListener('beforeunload', () => {
      //Close browser wiill set status to offline
      if (currentUserApp && currentRoom) {
        setStatusMember(currentRoom.roomId, currentUserApp.uid, false);
      }
    });
    return () => {
      if (currentUserApp && currentRoom && currentRoom.roomId) {
        //Component unmount will set status to offline
        //because member is not in room
        setStatusMember(currentRoom.roomId, currentUserApp.uid, false);
      }
    };
  }, [currentRoom]);
  return (
    <>
      <Head>
        <title>Room | Stick Together</title>
        <meta name="description" content="Login Stick Together" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {currentRoom && !openAlreadyRoom ? (
        <main>
          <MainComponent />
        </main>
      ) : (
        <Box sx={{ color: 'text.primary' }} className={styles.roomLoading}>
          <LoadingComponent/>
          <p>Loading room infos....</p>
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
      <Dialog
        open={openAlreadyRoom}
        onClose={handleOk}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'ERROR'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have already joined room: {currentUserApp?.roomId}
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
