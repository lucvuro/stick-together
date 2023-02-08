import { MusicBoxContext } from '@/Contexts/musicboxContext';
import { useContext, useState } from 'react';
import useRoom from './useRoom';

const useMusicBox = () => {
  const musicboxContent = useContext(MusicBoxContext);
  const {currentRoom} = useRoom()
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);
  const searchYoutube = async (keyword: string) => {
    if (keyword) {
      setLoadingSearch(true);
      setOptions([]);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APILINK}/search/${keyword}`
        );
        const jsonFromResponse = await response.json();
        const listMusicFromKeyword = jsonFromResponse.result;
        setOptions(listMusicFromKeyword);
      } catch (err) {
        console.log(err);
        setOptions([]);
      } finally {
        setLoadingSearch(false);
      }
    } else {
      setOptions([]);
    }
  };
  const addMusicToPlaylist = async (value: string) => {
    console.log(value)
    if (value && currentRoom) {
      // const valueParsed = JSON.parse(value);
      // const data = {
      //   id: valueParsed.id,
      // };
      setOptions([])
      setLoadingAdd(true)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_APILINK}/stream/${currentRoom.roomId}/add`, {
          method: 'POST',
          body: value,
        });
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingAdd(false)
      }
    }
  };
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
    currentSong,
    searchYoutube,
    loadingSearch,
    options,
    addMusicToPlaylist,
    loadingAdd
  };
};
export default useMusicBox;
