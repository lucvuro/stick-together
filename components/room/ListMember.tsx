import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Member } from '@/Contexts/roomContext';
export interface ListMemberProps {
    listMember: Member[] | null | undefined
}

export function ListMember (props: ListMemberProps) {
    const {listMember} = props
  return (
    <>
    <List>
            {listMember?.map((member: Member) => (
              <ListItem key={member.uid} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleIcon/>
                  </ListItemIcon>
                  <ListItemText primary={member.email} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
    </>
  );
}
