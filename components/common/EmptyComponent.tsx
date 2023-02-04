import { Box } from '@mui/material';
import Image from 'next/image';
import empty from '@/assets/images/no-task.png'
import React from 'react';

export interface EmptyComponentProps {
}

export default function EmptyComponent (props: EmptyComponentProps) {
  return (
    <Box sx={{opacity: '0.9'}}>
        <Image src={empty} alt='empty' width={150} height={150}/>
    </Box>
  );
}
