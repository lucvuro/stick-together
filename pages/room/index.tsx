import useAuth from '@/hooks/useAuth';
import React, { useEffect } from 'react';

export interface RoomPageProps {
}

export default function Room (props: RoomPageProps) {
    const {router} = useAuth()
    useEffect(() => {router.push('/')},[])
  return (
    <div>
      
    </div>
  );
}