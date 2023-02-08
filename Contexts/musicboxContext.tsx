import { User } from 'firebase/auth';
import React, { createContext, ReactNode, useState } from 'react';
export interface MusicBoxContextType {
  openMusicBox: boolean;
  setOpenMusicBox: React.Dispatch<React.SetStateAction<boolean>>
  currentSong: Song | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song|null>>;
  playlist: Song[];
  setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
}
export interface Song {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
}
const MusicBoxContext = createContext<MusicBoxContextType>({
  openMusicBox: false,
  setOpenMusicBox: () => {},
  currentSong: null,
  setCurrentSong: () => {},
  playlist: [],
  setPlaylist: () => {}
});
const { Provider } = MusicBoxContext;
const MusicBoxProvider = ({ children }: { children: ReactNode }) => {
  const [openMusicBox, setOpenMusicBox] = useState<boolean>(false)
  const [currentSong, setCurrentSong] = useState<Song|null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([])
  return (
    <Provider
      value={{openMusicBox, setOpenMusicBox, currentSong, setCurrentSong, playlist, setPlaylist}}
    >
      {children}
    </Provider>
  );
};

export { MusicBoxContext, MusicBoxProvider };
