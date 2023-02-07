import React, { SetStateAction } from 'react';
export const copyToClipBoard = async (value: string, callback: React.Dispatch<SetStateAction<boolean>>) => {
  await navigator.clipboard.writeText(value);
  callback(true)
  setTimeout(() => {
    callback(false)
  }, 3000)
};
