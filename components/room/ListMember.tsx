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
import { Member} from '@/Contexts/roomContext';
import { styled } from '@mui/material/styles';
import useRoom from '@/hooks/useRoom';
import useDatabase from '@/hooks/useDatabase';
export interface ListMemberProps {}
export function ListMember(props: ListMemberProps) {
  const {listMember, setListMember, currentRoom} = useRoom()
  const {onValueCustom} = useDatabase()
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
    const unsub = onValueCustom(`rooms/${currentRoom?.roomId}/members`, (members: Object) => {
      if(members){
        setListMember(Object.values(members))
      }
    })
    return () => unsub()
  },[])
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
