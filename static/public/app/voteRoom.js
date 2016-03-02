/**
 * Created by nkhri on 02.03.2016.
 */

"use strict";


var socket = io(location.pathname.replace('/rooms', '')),
  btnStart = document.getElementById('btnStart'),
  btnList = document.getElementsByClassName('btn-list')[0],
  result = document.getElementsByClassName('result')[0],
  wait = document.getElementsByClassName('vote-result__svg')[0],
  popupEl = document.getElementById('popup'),
  open = document.getElementById('open'),
  user = localStorage.getItem('user'),
  wathcerLink = document.getElementById('wathcer-link');


var popup = new Popup(popupEl, {
  width: 400,
  height: 200
});

btnList.classList.add('btn-list--disable');


if (user) {
  initVote(user);
} else {
  getUser();
}


btnStart.onclick = function () {
  socket.emit('start');
};

wathcerLink.onclick = function () {
  popup.close();
  initVote();
};

function clickBtn(data) {
  socket.emit('vote', data);
   btnList.classList.add('btn-list--disable');
}

function addUser() {
  var userName = document.getElementById('nameUser').value;
  if (userName) {
    localStorage.setItem('user', userName);
    popup.close();
    initVote(userName);
  }
}

function getUser() {
  popup.open();
  popupEl.classList.remove('m-hide');
}

function initVote(user) {

  socket.emit('connect user', user);

  socket.on('start', function (msg) {
    console.log('Stat');
    result.textContent = '';
    btnList.classList.remove('btn-list--disable');
    wait.classList.remove('m-hide');
    result.classList.add('m-hide');
  });

  socket.on('finish', function (msg) {
    wait.classList.add('m-hide');
    result.classList.remove('m-hide');
    result.textContent = msg;
  });

  socket.on('add user', function (msg) {
    //document.getElementsByClassName('userCount')[0].textContent = msg;
  });

  socket.on('update:users', function (users) {
    var userList = document.getElementsByClassName('users-list')[0];
    userList.innerHTML = '';

    users.forEach(function (user) {
      var div = document.getElementById('templateUser').cloneNode(true);
      div.removeAttribute('id');
      div.classList.remove('m-hide');

      var name = div.getElementsByClassName('users-list__item__name')[0];
      name.innerHTML = user.name;

      var result = div.getElementsByClassName('users-list__item__result')[0];
      if (user.status) {
        result.classList.add('users-list__item__result--' + user.status);
        console.log('status', user.status);
        result.innerHTML = (user.status && user.status != 'done' ? user.status : '') + (user.result ? user.result : '');
      } else {
        result.classList.add('m-hide');
      }

      userList.appendChild(div);
    });

  });
}