const { io } = require('socket.io-client')

const socket = io('http://localhost:5000')

socket.on('connect', () => {
  console.log('connected', socket.id)
  socket.disconnect()
})

socket.on('connect_error', (err) => {
  console.error('connect_error', err)
  process.exit(1)
})
