document.addEventListener('DOMContentLoaded', () => {


    ////////////////////////////////////////////////////////////////////////
    // Get a username if it is a new user
    ////////////////////////////////////////////////////////////////////////
    var username = localStorage.getItem("username");

    if (localStorage.getItem("username") == null)
    {

        var txt;
        var username = prompt("Please enter your name:", "Hermione Granger");
        if (username == null || username == "") {
            txt = "Username not set.";
        } else {
            txt = "Hello " + username + "! How are you today?";
            localStorage.setItem('username', username);
        }
        document.getElementById("demo").innerHTML = txt;

    }


    ////////////////////////////////////////////////////////////////////////
    // Get messages from form and stuff
    ////////////////////////////////////////////////////////////////////////

    // By default, submit button is disabled
    document.querySelector('#submit').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#message').onkeyup = () =>
    {
        if (document.querySelector('#message').value.length > 0)
            document.querySelector('#submit').disabled = false;
        else
            document.querySelector('#submit').disabled = true;
    };

    // THIS IS WHEN THE MESSAGE IS SUBMITTED
    document.querySelector('#form').onsubmit = () =>
    {

        //get message and date
        let text = document.querySelector('#message').value;
        let time = new Date();

        // Log the data on the console
        console.log(text);
        console.log(time);
        console.log(username);

        // send message to server
        socket.emit('newmessage', {
            'user': localStorage.getItem('username'),
            'time': time,
            'message': text,
            //'channel': current_channel
            'time': time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });

        // Clear input field and disable button again
        document.querySelector('#message').value = '';
        document.querySelector('#submit').disabled = true;

        // Stop form from submitting
        return false;

    };

    ///////////////////////////////////////////////////////////////////////////
    // WEB SOCKET ON CONNECT
    //////////////////////////////////////////////////////////////////////////

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () =>
    {

        // ADD STUFF HERE FOR WHEN THE SOCKET CONNECTS

    });



    //////////////////////////////////////////////////////////////////////////
    // WEB SOCKET ON DATA
    //////////////////////////////////////////////////////////////////////////

    socket.on('messages', data =>
    {

        // Create new item for list
        const li = document.createElement('li');

        // Add the message/date/usernate to item
        li.innerHTML = data.user + ' - ' + data.time + '<br>' + data.message + '<br>' + '<hr>' ;

        // Add new item to task list
        document.querySelector('#tasks').append(li);

        // scroll the page down
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);


    });



});
