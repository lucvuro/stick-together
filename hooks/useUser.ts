import { UserApp, UserContext } from '@/Contexts/userContext';
import { database } from '@/firebase';
import { UserCredential } from 'firebase/auth';
import { child, DataSnapshot, get, ref, set } from 'firebase/database';
import { useContext } from 'react';

const useUser = () => {
  const userContext = useContext(UserContext);
  const { currentUserApp, setCurrentUserApp } = userContext;
  return {
    currentUserApp,
    setCurrentUserApp
  };
};

export default useUser;
