import LoadingComponent from '@/components/common/LoadingComponent';
import { Paper } from '@mui/material';
import * as React from 'react';

export interface TestProps {
}

export default function TestPage (props: TestProps) {
  return (
    <Paper>
      <LoadingComponent/>
    </Paper>
  );
}
