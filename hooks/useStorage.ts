import { storage } from '@/firebase';
import { parseFileFromBase64 } from '@/utils/parseFile';
import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { useState } from 'react';
import useAuth from './useAuth';

const useStorage = () => {
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [processUpload, setProcessUpload] = useState<number>(0)
    const {updateProfileToFirebase} = useAuth()
  const uploadAvatar = async (
    userId: string,
    avatarUrl: string,
    type: string,
    closeModal: () => void
  ) => {
    setLoadingUpload(true)
    try {
      const avatarRef = ref(storage, `images/avatar/${userId}`);
      const fileFromBase64 = await parseFileFromBase64(avatarUrl, userId, type)
      const uploadTask = uploadBytesResumable(avatarRef, fileFromBase64, {contentType: type})
      uploadTask.on('state_changed', (snapshot) => {
        setProcessUpload((snapshot.bytesTransferred/snapshot.totalBytes)*100)
      })
      const urlImage = await getDownloadURL(avatarRef)
      const profile = {
        photoUrl: urlImage
      }
      await updateProfileToFirebase(profile)
    } catch (err) {
      console.log(err);
    } finally {
        setLoadingUpload(false)
        closeModal()
    }
  };
  return {
    uploadAvatar,
    loadingUpload,
    processUpload
  };
};

export default useStorage;
