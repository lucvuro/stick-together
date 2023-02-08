import React, {useState} from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ListMember } from './ListMember';
import ChatComponent from './ChatComponent';
import useUser from '@/hooks/useUser';
import useRoom from '@/hooks/useRoom';
import { UserControl } from './UserControl';
import { Fab, Stack, Tooltip } from '@mui/material';
import useMusicBox from '@/hooks/useMusicBox';
import { MusicBoxModal } from './chat/MusicBoxModal';
import { LoadingButton } from '@mui/lab';
import useDatabase from '@/hooks/useDatabase';
import { useRouter } from 'next/router';
import { copyToClipBoard } from '@/utils/copyToClipboard';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  position: 'relative',
  flexGrow: 1,
  //   padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
interface MainComponetProps {}
export default function MainComponent(props: MainComponetProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { currentUserApp } = useUser();
  const { currentRoom } = useRoom();
  const { leaveRoomFromUser, loadingLeave } = useDatabase();
  const router = useRouter();
  const onClickLeaveRoom = async () => {
    if (currentRoom && currentUserApp) {
      await leaveRoomFromUser(currentUserApp, currentRoom);
      router.push('/');
    }
  };
  const [copy, setCopy] = useState<boolean>(false)
  return (
    <>
      {currentUserApp && currentRoom && (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Stack
                sx={{ width: '100%' }}
                justifyContent="space-between"
                spacing={2}
                direction="row"
              >
                <Typography
                  sx={{ width: { xs: '150px', md: '400px' } }}
                  variant="h6"
                  noWrap
                  component="div"
                >
                  Room ID:{' '}
                  <Tooltip
                    title={copy ? 'Coppied' : 'Click to coppy'}
                    arrow
                    placement="top"
                  >
                    <span
                      style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onClick={() => {
                        if (!copy && currentRoom.roomId) {
                          copyToClipBoard(currentRoom.roomId, setCopy);
                        }
                      }}
                    >
                      {currentRoom.roomId}
                    </span>
                  </Tooltip>
                </Typography>
                <LoadingButton
                  loading={loadingLeave}
                  onClick={onClickLeaveRoom}
                  color="error"
                  variant="contained"
                >
                  Leave Room
                </LoadingButton>
              </Stack>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                justifyContent: 'space-between',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <Box>
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <ListMember />
            </Box>
            <UserControl />
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <ChatComponent />
            <MusicBoxModal />
          </Main>
        </Box>
      )}
    </>
  );
}
