import {
  Avatar,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Member } from '@/Contexts/roomContext';
import { styled } from '@mui/material/styles';
import useRoom from '@/hooks/useRoom';
import useDatabase from '@/hooks/useDatabase';
import useUser from '@/hooks/useUser';
import { MediaConnection } from 'peerjs';
import ProfileCard from './ProfileCard';
import { useRouter } from 'next/router';
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
export interface ListMemberProps {}
export function ListMember(props: ListMemberProps) {
  const {
    listMember,
    setListMember,
    currentRoom,
    setMediaStream,
    setAudiosFromPeer,
  } = useRoom();
  const {
    onValueCustom,
    setPeerIdToMember,
    getMemberFromRoom,
    setStatusMember,
    loadingLeave,
  } = useDatabase();
  const { currentUserApp } = useUser();
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLDivElement) | null
  >(null);
  const open = Boolean(anchorEl);
  const handleClick = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    memberId: string | undefined
  ) => {
    if (memberId && event.currentTarget) {
      setAnchorEl(event.currentTarget);
      await setMemberToProfileCard(memberId);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const setMemberToProfileCard = async (memberId: string) => {
    setCurrentMember(null);
    if (currentRoom) {
      const member = await getMemberFromRoom(currentRoom?.roomId, memberId);
      setCurrentMember(member);
    }
  };
  const router = useRouter();
  useEffect(() => {
    const unsub = onValueCustom(
      `rooms/${currentRoom?.roomId}/members`,
      (members: Object) => {
        if (members) {
          setListMember(Object.values(members));
        }
      }
    );
    return () => {
      unsub();
      setListMember([])
    }
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
          mediaStream.getAudioTracks()[0].enabled = false;
          setMediaStream(mediaStream);
          peer = new Peer();
          peer.on('call', (call: MediaConnection) => {
            call.answer(mediaStream);
            call.on('stream', (remoteStream: MediaStream) => {
              const audio = new Audio();
              audio.autoplay = true;
              audio.srcObject = remoteStream;
              audio.id = remoteStream.id;
              setAudiosFromPeer(audio);
            });
          });
          peer.on('error', (err: any) => {
            console.log('error', err);
          });
          peer.on('close', () => {
            if (currentRoom && currentUserApp) {
              setStatusMember(currentRoom.roomId, currentUserApp.uid, false);
            }
          });
          peer.on('open', (id: string) => {
            if (currentRoom?.roomId) {
              setPeerIdToMember(currentRoom?.roomId, currentUserApp.uid, id);
              setStatusMember(currentRoom.roomId, currentUserApp.uid, true);
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
                  audio.id = remoteStream.id;
                  setAudiosFromPeer(audio);
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
            <ListItemButton
              sx={{ gap: '.8rem' }}
              onClick={(e) => handleClick(e, member.uid)}
            >
              {member.isOnline ? (
                <StyledBadgeOnline
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  {member.photoUrl ? (
                    <Avatar
                      src={member.photoUrl}
                      sx={{ width: 36, height: 36 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }} />
                  )}
                </StyledBadgeOnline>
              ) : (
                <StyledBadgeOffline
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  {member.photoUrl ? (
                    <Avatar
                      src={member.photoUrl}
                      sx={{ width: 36, height: 36 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 36, height: 36 }} />
                  )}
                </StyledBadgeOffline>
              )}
              <ListItemText
                primary={member.nickname ? member.nickname : member.email}
                primaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Popover
        id="popver-profile-card"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={24}
      >
        <ProfileCard member={currentMember} />
      </Popover>
    </>
  );
}
