export const getErrorFirebase =  (err: any) => {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'Email is already used';
    default:
      return 'Unknown Error';
  }
};
