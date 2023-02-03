import { MusicBoxContext } from '@/Contexts/musicboxContext';
import { useContext } from 'react';

const useMusicBox = () => {
  const musicboxContent = useContext(MusicBoxContext);
  const {
    openMusicBox,
    setOpenMusicBox,
    setPlaylist,
    setCurrentSong,
    playlist,
    currentSong,
  } = musicboxContent;
  return {
    openMusicBox,
    setOpenMusicBox,
    setPlaylist,
    setCurrentSong,
    playlist,
    currentSong
  };
};
export default useMusicBox;
