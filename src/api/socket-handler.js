'use strict'

let cookie = require('cookie')
let jwt = require('jsonwebtoken')
let io

/**
 * Tests whether the user is authorized and in the authorized room
 *
 * @param socketId
 * @returns {boolean}
 */
let userIsInAuthorizedRoom = (socketId) => {

  // If the room doesn't even exist, return false
  if (typeof io.sockets.adapter.rooms['authorized'] === 'undefined') {
    return false
  }
  return (typeof io.sockets.adapter.rooms['authorized'][socketId] !== 'undefined')
}

/**
 * Attempts to authenticate a socket connection via a JWT cookie
 * @param socket
 */
let authenticateSocketUser = (socket) => {
  try {

    let parsedCookies = cookie.parse(socket.handshake.headers['cookie'])

    if (typeof parsedCookies.mc_jwt !== 'undefined') {

      let decoded = jwt.verify(parsedCookies.mc_jwt, process.env.SECRET_KEY)

      if (typeof decoded.user_id !== 'undefined') {

        console.log('jwt found and validated')

        // Join them to the authorized room (unless they are already in there)
        if (!userIsInAuthorizedRoom(socket.id)) {
          console.log('user is not already in the authorized room, joining them to it now')
          socket.join('authorized')
        } else {
          console.log('user is already in the authorized room')
        }

        // Either way, if we made it here, broadcast the initial (pipeline) data
        emitActivePipelinesToSpecificSocket(socket.id)
      }

    }

  } catch (err) {
    console.log(err)
  }

}

let getActivePipelines = () => {

  // ....
  return {
    this_is: 'fake active pipelines data'
  }

}

let emitActivePipelinesToSpecificSocket = (socketId) => {
  io.sockets.connected[socketId].emit('update_active_pipelines', getActivePipelines())
}

let emitActivePipelinesToAllAuthorizedSockets = () => {
  io.sockets.in('authorized').emit('update_active_pipelines', getActivePipelines());
}

// On update_active_pipelines rsmq event, publish ws event
//worker.on('message')
//
setInterval(emitActivePipelinesToAllAuthorizedSockets, 6000)


module.exports = (server) => {

  io = require('socket.io')(server)

  // As a test, we'll emit an event to only authorized users every 5 seconds
  setInterval(() => {
    io.to('authorized').emit('client_side_log', {message: 'only authorized users should see this'})
  }, 5000)

  setInterval(() => {
    io.emit('client_side_log', {message: 'all users should see this'})
  }, 7000)

  io.on('connection', (socket) => {

    console.log('SIO: User Connected: ' + socket.id)

    // Attempt to authenticate the user on connection (via their JWT)
    authenticateSocketUser(socket)

    socket.on('disconnect', function() {
      console.log('SIO: User Disconnected: ' + socket.id)
    })

  })

}
