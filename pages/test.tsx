import LoadingComponent from '@/components/common/LoadingComponent';
import ProfileCard from '@/components/room/ProfileCard';
import { Paper } from '@mui/material';
import * as React from 'react';

export interface TestProps {
}

export default function TestPage (props: TestProps) {
  return (
    <ProfileCard/>
  );
}
