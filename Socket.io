import SocketIOClient from 'socket.io-client';

 const connectSocket = () => {
        let { userData } = props.user
        let link = `https://mylink-sockets.netsolutionindia.com?access_token=${userData.access_token}`
        socket = SocketIOClient(link, { transports: ['websocket'] });
        socket.on('connect', () => {

            console.log('===== socket connected =====');
        })
        socket.on('sendMsgResp', (response) => {
            updateMessageRecieved(response)
        })

        socket.on('disconnect', () => {

            console.log('socket disconnected');
        });
        socket.on('connect_error', err => {

            console.log('socket connection error: ', JSON.stringify(err));
        })
        socket.on('error', err => {

            console.log('socket error: ', JSON.stringify(err));
        })
        socket.on('connection', () => {

            console.log('response from server')
        })
    }
