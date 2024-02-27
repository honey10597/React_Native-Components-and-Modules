
export const ConnectingSocket = userData => {
  console.log(userData, 'user SOCKET');
  const token = userData?.accessToken
  const socketLink = `${SOCKET_URL}`;
  // const socketLink = `${SOCKET_URL}?user_id=${userData?.id}`
  //   socketRef = io(socketLink, { transports: ['websocket'] })
  socketRef = io(socketLink, { auth: { token } });

  socketRef.on('connect', () => {
    console.log('===== socket connected ===== Connecting SOCKET');
  });
  socketRef.on('connect_error', err => {
    console.log('SOCKET connection error: ', JSON.stringify(err));
  })
  socketRef.on('error', err => {
    console.log('SOCKET error: ', JSON.stringify(err));
  })
  socketRef.on('connection', () => {
    console.log('SOCKET response from server')
  })
};
