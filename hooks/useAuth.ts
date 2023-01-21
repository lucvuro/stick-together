import { AuthContext } from '@/Contexts/authContext';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { auth } from '@/firebase';
const useAuth= () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  return {
    router,
    authContext,
    auth,
  };
};

export default useAuth;
