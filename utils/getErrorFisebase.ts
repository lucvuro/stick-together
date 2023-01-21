export const getErrorFirebase = (err: any) => {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'Email is already used';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/too-many-requests':
      return 'Too many requests';
    default:
      return 'Unknown Error';
  }
};
