const { PeerServer } = require('peer');

const peerServer = PeerServer({ port: 9000, path: '/api/peerjs' });
export default peerServer