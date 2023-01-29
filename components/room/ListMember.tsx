import {
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Member } from '@/Contexts/roomContext';
import { styled } from '@mui/material/styles';
import useRoom from '@/hooks/useRoom';
import useDatabase from '@/hooks/useDatabase';
import useUser from '@/hooks/useUser';
import { MediaConnection } from 'peerjs';
export interface ListMemberProps {}
export function ListMember(props: ListMemberProps) {
  const { listMember, setListMember, currentRoom } = useRoom();
  const { onValueCustom } = useDatabase();
  const { currentUserApp } = useUser();
  const StyledBadgeOnline = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  const StyledBadgeOffline = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#808080',
      color: '#808080',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
        content: '""',
      },
    },
  }));
  useEffect(() => {
    const unsub = onValueCustom(
      `rooms/${currentRoom?.roomId}/members`,
      (members: Object) => {
        if (members) {
          setListMember(Object.values(members));
        }
      }
    );
    return () => unsub();
  }, []);
  useEffect(() => {
    let peer: any;
    import('peerjs').then(({ default: Peer }) => {
      // normal synchronous code
      const getMediaStream = async () => {
        if (currentUserApp && currentUserApp.uid) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          peer = new Peer(currentUserApp.uid, {
            host: process.env.NEXT_PUBLIC_HOST,
            port: 80,
            path: 'api/peerjs',
          });
          listMember.forEach((member: Member) => {
            if (member.uid && member.isOnline) {
              const call = peer.call(member.uid, mediaStream, {
                metadata: {
                  host: process.env.NEXT_PUBLIC_HOST,
                  port: 80,
                  path: 'api/peerjs',
                },
              });
              call.on('stream', (remoteStream: MediaStream) => {
                console.log('remote', remoteStream);
                const audio = new Audio();
                audio.autoplay = true;
                audio.srcObject = remoteStream;
              });
              call.on('error', (error: any) => {
                console.log('error call', error);
              });
            }
          });
          peer.on('call', (call: MediaConnection) => {
            console.log('call', call);
            call.answer(mediaStream);
            call.on('stream', (remoteStream: MediaStream) => {
              const audio = new Audio();
              audio.autoplay = true;
              audio.srcObject = remoteStream;
            });
          });
          peer.on('error', (err: any) => {
            console.log('error', err.type);
          });
          peer.on('open', (id: string) => {
            console.log('open', id);
          });
        }
      };
      getMediaStream();
    });
    window.addEventListener('beforeunload', () => {
      //Close browser wiill set status to offline
      if (peer) {
        peer.destroy();
      }
    });
    return () => {
      if (peer) peer.destroy();
    };
  }, [currentUserApp]);
  return (
    <>
      <List>
        {listMember.map((member: Member) => (
          <ListItem key={member.uid} disablePadding>
            <ListItemButton sx={{ gap: '.8rem' }}>
              {member.isOnline ? (
                <StyledBadgeOnline
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar sx={{ width: 36, height: 36 }}>V</Avatar>
                </StyledBadgeOnline>
              ) : (
                <StyledBadgeOffline
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar sx={{ width: 36, height: 36 }}>V</Avatar>
                </StyledBadgeOffline>
              )}
              <ListItemText primary={member.email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
}
