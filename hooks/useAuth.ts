import { AuthContext } from '@/Contexts/authContext';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { auth } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import useDatabase from './useDatabase';
interface IProfile {
  photoUrl?: string;
  displayName?: string
}
const useAuth= () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const {getUserAndSetUserApp} = useDatabase()
  const updateProfileToFirebase = async (profile: IProfile) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          photoURL: profile.photoUrl
        });
        await getUserAndSetUserApp(auth.currentUser)
      } catch (err) {
        console.log(err);
      }
    }
  };
  return {
    router,
    authContext,
    auth,
    updateProfileToFirebase
  };
};

export default useAuth;
