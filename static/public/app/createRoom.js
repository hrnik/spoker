/**
 * Created by nkhri on 02.03.2016.
 */
function clickBtn() {
  var xhr = new XMLHttpRequest();

  var body = 'name=' + encodeURIComponent(document.getElementById('nameRoom').value);

  xhr.open("POST", '/rooms', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

  xhr.onreadystatechange = function () { // (3)
    if (xhr.readyState != 4) return;


    if (xhr.status != 200) {
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      var response = JSON.parse(xhr.response);
      location.replace(location.origin + '/rooms/' + response.room);

    }

  };

  xhr.send(body);
}
