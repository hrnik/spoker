var koa = require('koa');
var views = require('koa-views');
var session = require('koa-session');
var koaStatic = require('koa-static');
var Voting = require('modules/vote').Voting;
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');


var app = koa();

app.keys = ['some secret hurr'];

app.use(views('templates', {map: {html: 'nunjucks'}}));
app.use(koaStatic('static'));
app.use(session(app));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
var server = require('http').Server(app.callback()),
  io = require('socket.io')(server),
  chatRooms = new Set();
chatRooms.add('developers');
chatRooms.add('marketing');

chatRooms.forEach(room => createRoomChat(room));


app.use(function *() {

  yield this.render('index', {
    rooms: Array.from(chatRooms)
  });
});


router
  .get('/rooms/:room', function *(next) {
    if (!chatRooms.has(this.params.room)) {
      createRoomChat(this.params.room);
      chatRooms.add(this.params.room)
    }
    var voteValues = this.params.room === 'marketing' ? ['1', '2', '3', '5', '8', '13']
      : ['1/4', '1/2', '1', '2', '3', '5', '8', '13'];
    yield this.render('rooms', {
      voteValues: voteValues
    });
  })
  .post('/rooms', function *(next) {
    this.body = {
      status: 'ok',
      room: this.request.body.name
    };

  });


function createRoomChat(nspname) {
  var room = {},
    users = new Map(),
    results = new Map();

  var roomName = 'vote room';
  var nsp = io.of('/' + nspname);
  nsp.on('connection', socket => {
    var userName = {};

    socket.join(roomName);


    socket.on('connect user', data => {
      if (data) {
        userName = data;
        if (!users) {
          users = new Map();
        }

        users.set(data, {
          name: userName
        });

      }
      updateUsers(users);
    });

    socket.on('start', (id, data) => {
      room.voting = new Voting();
      nsp.to(roomName).emit('start');

      for (var key of users.keys()) {
        var user = users.get(key);
        user.status = 'wait';
        user.result = undefined;
        users.set(key, user);
      }

      results.clear();

      updateUsers(users);

      setTimeout(()=> {
        finisVote();
      }, 10000)

    });

    socket.on('vote', data => {
      var user = users.get(userName);
      if (user) {
        user.status = 'done';
        users.set(userName, user);
        updateUsers(users);

        results.set(userName, data);

        var isAllDone = true;

        for (var user of users.values()) {
          if (user.status !== 'done') {
            isAllDone = false;
            break;
          }
        }

        room.voting.addVote(data);

        if (isAllDone) {
          finisVote();
        }
      }
    });

    socket.on('disconnect', function () {
      users.delete(userName);
      updateUsers(users);
    });

    function finisVote() {

      for (var key of users.keys()) {
        var user = users.get(key);
        if (results.has(key)) {
          user.result = results.get(key);
        } else {
          user.status = 'fail';
        }
        users.set(key, user);
      }

      updateUsers(users);


      nsp.to(roomName).emit('finish', room.voting.result());
    }


    function updateUsers(users) {
      nsp.to(roomName).emit('update:users', Array.from(users.values()));
    }

  });
}

server.listen(process.env.PORT || 3000);
console.log('Server listen on localhost:3000');