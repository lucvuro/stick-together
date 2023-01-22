import { useRouter } from 'next/router';
import * as React from 'react';

export interface RoomDetailProps {
}

export default function RoomDetail (props: RoomDetailProps) {
    const router = useRouter()
    const {roomId} = router.query
  return (
    <div>
      {roomId}
    </div>
  );
}
