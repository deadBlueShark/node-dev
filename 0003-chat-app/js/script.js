$(() => {
  const BASE_URL = 'http://localhost:3000';

  $("#send-button").click(function() {
    let name = $("#sender").val();
    let content = $("#content").val();

    if(!(name || content)) return;
    let message = { name: name, content: content }

    $.post(`${BASE_URL}/messages`, message, (data, status) => {
      if (status != 'success') return;
      displayMessage(message)
    })
  });

  $.get(`${BASE_URL}/messages`, (data, status) => {
    if (status != 'success') throw status;
    $.each(data, (index, value) => {
      displayMessage(value);
    })
  })
})

function displayMessage(message) {
  $("#message-display").append(`<div><strong>${message.name}: </strong>${message.content}<div>`)
}
