import { Box } from '@mui/material';
import * as React from 'react';
import Loading from '@/assets/images/spinner.svg';
import Image from 'next/image';
export interface LoadingComponentProps {
}

export default function LoadingComponent(props: LoadingComponentProps) {
  return (
    <Box>
      <Image width={50} height={50} alt="loading" src={Loading} />
    </Box>
  );
}
