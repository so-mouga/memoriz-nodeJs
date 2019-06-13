const app = require('express');
const router = app.Router();
const GameManager = require('../../manager/game.manager');
const rooms = new Map();

const ROOM_USER_CREATE = 'room-user-create';
const ROOM_USER_DELETE = 'room-user-delete';
const ROOM_PLAYER_JOIN = 'room-player-join';
const ROOM_NOTIFY_USER_NEW_PLAYER_JOIN = 'room-notify-user-new-player-join';
const ROOM_NOTIFY_PLAYER_ROOM_CLOSED = 'room-user-leave-notify-players';
const ROOM_NOTIFY_USER_THAT_PLAYER_LEFT = 'room-player-leave-notify-user';

const io = function(io) {
  io.on('connection', socket => {
    console.log(`Socket ${socket.id} connected.`);

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });

    /**
     * create room
     */
    socket.on(ROOM_USER_CREATE, message => {
      GameManager.getGameById(message.gameId).then(game => {
        if (!game) {
          socket.emit(ROOM_USER_CREATE, generateSocketResponse(ROOM_USER_CREATE, false, null, 'game not found'));
        }

        const roomId = generateRoomId();
        rooms.set(roomId, {
          roomId: roomId,
          game: game,
          userId: message.userId,
          socketId: socket.id,
          players: [],
        });

        socket.emit(ROOM_USER_CREATE, generateSocketResponse(ROOM_USER_CREATE, true, getRoomById(roomId)));
      });
    });

    /**
     * delete room
     */
    socket.on(ROOM_USER_DELETE, message => {
      const room = getRoomById(parseInt(message.roomId));
      // notify players
      room.players.forEach(player => {
        io.to(player.socketId).emit(
          ROOM_NOTIFY_PLAYER_ROOM_CLOSED,
          generateSocketResponse(ROOM_NOTIFY_PLAYER_ROOM_CLOSED, true, null, 'room is closed'),
        );
      });
      deleteRoomById(room.roomId);
    });

    /**
     * player join room
     */
    socket.on(ROOM_PLAYER_JOIN, message => {
      const room = getRoomById(parseInt(message.roomId));

      if (room) {
        const user = message.user;
        // todo uncomment this to restrict one same username by room
        // let player = room.players.find(player => player.userName === user.userName);
        // if (player) {
        //   socket.emit(ROOM_PLAYER_JOIN, generateSocketResponse(ROOM_PLAYER_JOIN, false, {}, 'Player already existing'));
        // } else {
        user.socketId = socket.id;
        room.players.push(user);
        socket.emit(ROOM_PLAYER_JOIN, generateSocketResponse(ROOM_PLAYER_JOIN, true, room, 'room found'));
        io.to(room.socketId).emit(
          ROOM_NOTIFY_USER_NEW_PLAYER_JOIN,
          generateSocketResponse(ROOM_NOTIFY_USER_NEW_PLAYER_JOIN, true, user, 'new player'),
        );
        // }
      } else {
        // room not found
        socket.emit(
          ROOM_PLAYER_JOIN,
          generateSocketResponse(ROOM_PLAYER_JOIN, false, {}, 'Aucune salle ne correspond à ce code.'),
        );
      }
    });

    /**
     * notify players that user close room
     */
    socket.on('room-user-leave', roomID => {
      const room = getRoomById(parseInt(roomID));
      room.players.forEach(player => {
        io.to(player.socketId).emit('room-user-leave-notify-players', 'room has deleted');
        console.log(player.socketId);
      });
    });

    /**
     * notify user that player leave room
     */
    socket.on(ROOM_NOTIFY_USER_THAT_PLAYER_LEFT, data => {
      const room = getRoomById(parseInt(data.roomId));
      if (room) {
        room.players = room.players.filter(player => player.userName !== data.user.userName);
        io.to(room.socketId).emit(
          ROOM_NOTIFY_USER_THAT_PLAYER_LEFT,
          generateSocketResponse('notify-user-player-leave', true, data.user, 'user has left'),
        );
      }
    });
  });
  return router;
};

function deleteRoomById(id) {
  rooms.delete(parseInt(id));
}

function generateRoomId() {
  const min = 100;
  const max = 1000000;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function getRoomById(id) {
  return rooms.get(id);
}

function generateSocketResponse(action, isSuccess, data, message = '') {
  return {
    success: isSuccess,
    data: data,
    message: message,
    action: action,
  };
}

module.exports = io;

// send to specific client
// io.to(socket.id).emit('private', 'Just for you bud');

// sending to all clients except sender
// socket.broadcast.emit('create-room', 'broadcast')
//
//  send all client
// io.sockets.emit('create-room', 'test');

// send to sender
// socket.emit('create-room', message);
