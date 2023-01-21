import { database } from '@/firebase';
import { User, UserCredential } from 'firebase/auth';
import { set, ref } from 'firebase/database';
const useDatabase = () => {
  const addUser = async (userCredential: UserCredential) => {
    try {
      await set(ref(database, 'users/' + userCredential.user.uid), {
        email: userCredential.user.email,
        roomId: '',
      });
    } catch(err) {
      console.log(err)
    }
  };
  return {
    database,
    addUser,
  };
};
export default useDatabase;
