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
  const { listMember, setListMember, currentRoom, setMediaStream, setAudiosFromPeer } = useRoom();
  const { onValueCustom, setPeerIdToMember } = useDatabase();
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
          mediaStream.getAudioTracks()[0].enabled = false
          console.log(mediaStream.id)
          setMediaStream(mediaStream)
          peer = new Peer();
          peer.on('call', (call: MediaConnection) => {
            call.answer(mediaStream);
            call.on('stream', (remoteStream: MediaStream) => {
              const audio = new Audio();
              audio.autoplay = true;
              audio.srcObject = remoteStream;
              audio.id = remoteStream.id
              setAudiosFromPeer(audio)
            });
          });
          peer.on('error', (err: any) => {
            console.log('error', err);
          });
          peer.on('open', (id: string) => {
            if (currentRoom?.roomId) {
              setPeerIdToMember(currentRoom?.roomId, currentUserApp.uid, id);
            }
            listMember.forEach((member: Member) => {
              if (
                member.peerId &&
                member.isOnline &&
                member.uid !== currentUserApp.uid
              ) {
                const call = peer.call(member.peerId, mediaStream);
                call.on('stream', (remoteStream: MediaStream) => {
                  const audio = new Audio();
                  audio.autoplay = true;
                  audio.srcObject = remoteStream;
                  audio.id = remoteStream.id
                  setAudiosFromPeer(audio)
                });
                call.on('error', (error: any) => {
                  console.log('error', error);
                });
              }
            });
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
              <ListItemText primary={member.email} primaryTypographyProps={{noWrap: true}}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  );
}
