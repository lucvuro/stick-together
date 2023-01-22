import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import useAuth from '@/hooks/useAuth';
import defaultAvatar from '@/assets/images/defaultAvatar.png';
import SettingsIcon from '@mui/icons-material/Settings';
import { ModalJoin } from '@/components/home/ModalJoin';
import useDatabase from '@/hooks/useDatabase';
import { LoadingButton } from '@mui/lab';
import { RoomContext } from '@/Contexts/roomContext';

export default function Home() {
  const { auth, authContext, router } = useAuth();
  const { currentUser } = authContext;
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const { createRoom, loadingCreate, getRoomFromUser, loadingRoom } =
    useDatabase();
  const roomContext = useContext(RoomContext);
  const {currentRoom} = roomContext
  const handleClickCreateRoom = async () => {
    await createRoom();
  };
  const handleClickRejoin = () => {
    router.push(`/room/${currentRoom?.roomId}`);
  };
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        authContext.setCurrentUser(user);
      } else {
        authContext.setCurrentUser(null);
        router.push('/login');
      }
    });
    return () => unsub();
  }, []);
  useEffect(() => {
    const getRoom = async () => {
      if (currentUser) {
        if (!currentRoom) await getRoomFromUser(currentUser);
      }
    };
    getRoom();
  }, [currentUser]);
  return (
    <>
      <Head>
        <title>Home | Stick Together</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Paper elevation={24} className={styles.homeContent}>
          <Box className={styles.homeProfile}>
            {currentUser ? (
              <>
                <Image
                  className={styles.homeProfileAvatar}
                  src={defaultAvatar}
                  alt="default-avatar"
                  width={150}
                  height={150}
                />
                <Box>
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </Box>
                <div className={styles.profileInfo}>
                  <p>{currentUser?.email}</p>
                </div>
              </>
            ) : (
              <>
                <Box className={styles.homeProfileLoading}>
                  <p>Loading your profile...</p>
                  <CircularProgress />
                </Box>
              </>
            )}
          </Box>
          <Box className={styles.homeActions}>
            {!loadingRoom ? (
              <>
                {!currentRoom ? (
                  <>
                    <LoadingButton
                      loading={loadingCreate}
                      onClick={handleClickCreateRoom}
                      sx={{ fontSize: '1.2rem' }}
                      variant="contained"
                    >
                      Create Room
                    </LoadingButton>
                    <Button
                      onClick={() => setOpenCreateModal(true)}
                      sx={{ fontSize: '1.2rem' }}
                      variant="contained"
                    >
                      Join Room
                    </Button>{' '}
                  </>
                ) : (
                  <>
                    <Box className={styles.homeRoomInfo}>
                      <p>Your room is: {currentRoom.roomId}</p>
                      <Button
                        onClick={handleClickRejoin}
                        sx={{ fontSize: '1.2rem' }}
                        variant="contained"
                      >
                        Re-join
                      </Button>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                <Box className={styles.homeProfileLoading}>
                  <p>Loading your room info...</p>
                  <CircularProgress />
                </Box>
              </>
            )}
          </Box>
        </Paper>
        <ModalJoin open={openCreateModal} setOpen={setOpenCreateModal} />
      </main>
    </>
  );
}
export async function getStaticProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}
