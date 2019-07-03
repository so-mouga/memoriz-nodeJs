const app = require('express');
const router = app.Router();
const GameManager = require('../../manager/game.manager');
const rooms = new Map();

const ROOM_FIND = 'room-find';
const ROOM_USER_CREATE = 'room-user-create';
const ROOM_USER_DELETE = 'room-user-delete';
const ROOM_PLAYER_JOIN = 'room-player-join';
const ROOM_PLAYERS_STATUS = 'room-players-status';
const ROOM_USER_REMOVE_PLAYER = 'room-user-remove-player';
const ROOM_NOTIFY_PLAYER_ROOM_CLOSED = 'room-user-leave-notify-players';
const ROOM_NOTIFY_USER_THAT_PLAYER_LEFT = 'room-player-leave-notify-user';
const ROOM_PLAY_START = 'room-play-start';
const ROOM_PLAY_GET_QUESTION = 'room-play-get-question';
const ROOM_PLAY_GET_SCORE_QUIZZ = 'room-play-get-score-quizz';
const ROOM_PLAY_SEND_SCORE = 'room-play-send-score';

const io = function(io) {
  io.on('connection', socket => {
    console.log(`Socket ${socket.id} connected.`);

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected.`);
    });

    socket.on(ROOM_PLAY_START, roomId => {
      const room = getRoomById(roomId);

      if (room) {
        room.players.forEach(player => {
          io.to(player.socketId).emit(ROOM_PLAY_START, generateSocketResponse(ROOM_PLAY_START, true, null, null));
        });
      }
    });

    socket.on(ROOM_PLAY_GET_SCORE_QUIZZ, message => {
      const room = getRoomById(message.roomId);
      let answers = [];

      if (room) {
        const player = room.players.find(player => player.username === message.username);
        room.game.questions.forEach(question => {
          answers.push({ answerPlayers: question.answerPlayers, question });
        });

        io.to(player.socketId).emit(
          ROOM_PLAY_GET_SCORE_QUIZZ,
          generateSocketResponse(ROOM_PLAY_GET_SCORE_QUIZZ, true, answers, null),
        );
      }
    });

    socket.on(ROOM_PLAY_SEND_SCORE, message => {
      const room = getRoomById(message.roomId);

      if (room) {
        room.game.questions.map(question => {
          if (question.id === message.questionId) {
            question.answerPlayers.push({
              username: message.username,
              answer: message.answer,
              isCorrect: message.isCorrect,
            });
          }
        });
      }
    });

    socket.on(ROOM_PLAY_GET_QUESTION, message => {
      const room = getRoomById(message.roomId);
      if (room) {
        const question = room.game.dataValues.questions[room.indexQuestion];
        room.indexQuestion++;

        if (question) {
          room.players.forEach(player => {
            io.to(player.socketId).emit(
              ROOM_PLAY_GET_QUESTION,
              generateSocketResponse(ROOM_PLAY_GET_QUESTION, true, question, ''),
            );
          });
        } else {
          room.players.forEach(player => {
            io.to(player.socketId).emit(
              ROOM_PLAY_GET_QUESTION,
              generateSocketResponse(ROOM_PLAY_GET_QUESTION, false, {}, 'quizz is finished'),
            );
          });
        }
      }
    });

    /**
     * create room
     */
    socket.on(ROOM_USER_CREATE, message => {
      GameManager.getGameById(message.gameId).then(game => {
        if (!game) {
          socket.emit(
            ROOM_USER_CREATE,
            generateSocketResponse(
              ROOM_USER_CREATE,
              false,
              null,
              'Hmm ... nous ne semblons pas pouvoir trouver ce quizz.',
            ),
          );
        }

        const player = {
          socketId: socket.id,
          isAdmin: true,
          ...message.user,
        };

        const roomId = generateRoomId();
        game.questions.forEach(question => {
          question.answerPlayers = [];
        });
        rooms.set(roomId, {
          roomId: roomId,
          game: game,
          userId: message.userId,
          socketId: socket.id,
          players: [player],
          indexQuestion: 0,
        });

        socket.emit(ROOM_USER_CREATE, generateSocketResponse(ROOM_USER_CREATE, true, getRoomById(roomId)));
      });
    });

    /**
     * find room
     */
    socket.on(ROOM_FIND, roomId => {
      const room = getRoomById(roomId);
      socket.emit(
        ROOM_FIND,
        generateSocketResponse(ROOM_FIND, !!room, room, room ? '' : 'aucune salle ne correspond à ce code'),
      );
    });

    /**
     * delete room
     */
    socket.on(ROOM_USER_DELETE, message => {
      const room = getRoomById(message.roomId);
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
      const room = getRoomById(message.roomId);

      if (room) {
        const user = message.user;
        // todo uncomment this to restrict one same username by room
        let player = room.players.find(player => player.username === user.username);
        if (player) {
          socket.emit(
            ROOM_PLAYER_JOIN,
            generateSocketResponse(ROOM_PLAYER_JOIN, false, {}, 'Le pseudo est déjà utilisé'),
          );
        } else {
          user.socketId = socket.id;
          user.isAdmin = false;
          room.players.push(user);
          socket.emit(ROOM_PLAYER_JOIN, generateSocketResponse(ROOM_PLAYER_JOIN, true, room, 'room found'));

          room.players.forEach(player => {
            io.to(player.socketId).emit(
              ROOM_PLAYERS_STATUS,
              generateSocketResponse(ROOM_PLAYERS_STATUS, true, room.players, 'new player'),
            );
          });
        }
      } else {
        // room not found
        socket.emit(
          ROOM_PLAYER_JOIN,
          generateSocketResponse(ROOM_PLAYER_JOIN, false, {}, 'Aucune salle ne correspond à ce code.'),
        );
      }
    });

    /**
     * Remove player and notify him
     */
    socket.on(ROOM_USER_REMOVE_PLAYER, message => {
      const room = getRoomById(message.roomId);
      if (room) {
        const player = room.players.find(player => player.id === message.playerId);
        if (player) {
          room.players = room.players.filter(player => player.id !== message.playerId);
          io.to(player.socketId).emit(
            ROOM_NOTIFY_PLAYER_ROOM_CLOSED,
            generateSocketResponse(
              ROOM_NOTIFY_PLAYER_ROOM_CLOSED,
              true,
              null,
              'On ta fait sortir de la salle, tu sera rediriger sur la page précédente',
            ),
          );
          room.players.forEach(player => {
            io.to(player.socketId).emit(
              ROOM_PLAYERS_STATUS,
              generateSocketResponse(ROOM_PLAYERS_STATUS, true, room.players, 'new player'),
            );
          });
        }
      }
    });

    /**
     * notify user that player leave room
     */
    socket.on(ROOM_NOTIFY_USER_THAT_PLAYER_LEFT, data => {
      const room = getRoomById(data.roomId);
      if (room) {
        room.players = room.players.filter(player => player.id !== data.user.id);
        room.players.forEach(player => {
          io.to(player.socketId).emit(
            ROOM_PLAYERS_STATUS,
            generateSocketResponse(ROOM_PLAYERS_STATUS, true, room.players, 'new player'),
          );
        });
      }
    });
  });
  return router;
};

function deleteRoomById(id) {
  rooms.delete(parseInt(id));
}

function generateRoomId() {
  const min = 10;
  const max = 9999;
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function getRoomById(id) {
  return rooms.get(parseInt(id));
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
