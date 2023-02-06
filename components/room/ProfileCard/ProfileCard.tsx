import { Avatar, Badge, Box, Divider, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import styles from '@/styles/ProfileCard.module.css'
import { styled } from '@mui/material/styles';
import { Member } from '@/Contexts/roomContext';
import LoadingComponent from '@/components/common/LoadingComponent';
import defaultBanner from '@/assets/images/defaultBanner.jpg';
import Image from 'next/image';
import { converUTCStringToDateTime } from '@/utils/convertTime';
export interface IProfileCard {
  member: Member | null;
}
const StyledBadgeOnline = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
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
    width: '20px',
    height: '20px',
    borderRadius: '50%',
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
export default function ProfileCard(props: IProfileCard) {
  return (
    <>
      {props.member ? (
        <Box className={styles.profileCard}>
          <Image
            alt="banner-profile"
            src={defaultBanner}
            className={styles.profileCardBanner}
          />
          <Box
            className={styles.profileCardAvatar}
            sx={{ color: 'text.primary' }}
          >
            {props.member.isOnline ? (
              <StyledBadgeOnline
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                {props.member.photoUrl ? (
                  <Avatar
                    sx={{width: '90px', height:'90px'}}
                    src={props.member.photoUrl}
                    className={styles.profileCardImage}
                  />
                ) : (
                  <Avatar className={styles.profileCardImage} />
                )}
              </StyledBadgeOnline>
            ) : (
              <StyledBadgeOffline
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                {props.member.photoUrl ? (
                  <Avatar
                    src={props.member.photoUrl}
                    className={styles.profileCardImage}
                  />
                ) : (
                  <Avatar className={styles.profileCardImage} />
                )}
              </StyledBadgeOffline>
            )}

            {/* <div className={styles.profileCardChange}>Change Avatar</div> use latter */}
          </Box>
          <Box className={styles.profileCardContent}>
            <Paper elevation={5} className={styles.profileCardInfo}>
              <p className={styles.profileCardTitle}>
                {props.member.nickname
                  ? props.member.nickname
                  : props.member.email}
              </p>
              <Divider />
              {props.member.about ? (
                <Stack className={styles.profileCardItem} spacing={0.5}>
                  <p
                    className={styles.profileCardSubTitle}
                  >
                    ABOUT ME
                  </p>
                  <Typography
                    variant="body2"
                  >
                    {props.member.about}
                  </Typography>
                </Stack>
              ) : (
                <></>
              )}
              <Stack className={styles.profileCardItem} spacing={0.5}>
                <p
                  className={styles.profileCardSubTitle}
                >
                  MEMBER SINCE
                </p>
                {props.member.joinDate && (
                  <Typography
                    variant="body2"
                  >
                    {converUTCStringToDateTime(
                      props.member.joinDate,
                      'MMM DD, YYYY'
                    )}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      ) : (
        <Box className={styles.profileCardLoading}>
          <LoadingComponent />
        </Box>
      )}
    </>
  );
}
