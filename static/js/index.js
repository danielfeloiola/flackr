/*******************************************************************************


 __________________
|  ______________  |
| |        __    | |  ______ _            _
| |       / /    | |  |  ___| |          | |
| |      / /     | |  | |_  | | __ _  ___| | ___ __
| |     / /      | |  |  _| | |/ _` |/ __| |/ / '__|
| |    / /       | |  | |   | | (_| | (__|   <| |
| |   /_/        | |  \_|   |_|\__,_|\___|_|\_\_|
| |______________| |
|__________________|


*******************************************************************************/

// A Slack alternative using Flask
// CS50 Web Project 2
// Version 1
// try it @ flackr.herokuapp.com

///////////////////////////////////////////////////////////////////////////
// AFTER PAGE IS LOADED
//////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    ///////////////////////////////////////////////////////////////////////
    // Get a username if it is a new user
    ////////////////////////////////////////////////////////////////////////

    // Check for local variable
    var username = localStorage.getItem("username");

    // if there is no username, prompt user
    if (localStorage.getItem("username") == null)
    {

        var txt;
        var username = prompt("Please enter your name:");
        if (username == null || username == "") {
            //txt = "Username not set.";
        } else {
            //txt = "Hello " + username + "! How are you today?";
            localStorage.setItem('username', username);
        }
        document.getElementById("demo").innerHTML = txt;

    }


    ///////////////////////////////////////////////////////////////////////////
    // SET UP CHANNELS
    //////////////////////////////////////////////////////////////////////////

    // Set the channel to general as standard
    localStorage.setItem('channel', 'general');

    // ASK FOR THE LIST WITH CHANNELS
    socket.emit('get_channels');

    // ASK FOR MESSAGES INSIDE THE CHANNEL
    // NOT READY YET.....
    //socket.emit('get_messages', {
        //'name': channelname,
    //});


    ////////////////////////////////////////////////////////////////////////
    // SEND MESSAGES TO BACKEND AND FORM SUBMISSION CONTROL
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
            'channel': localStorage.getItem('channel'),
            'time': time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });

        // Clear input field and disable button again
        document.querySelector('#message').value = '';
        document.querySelector('#submit').disabled = true;

        // Stop form from submitting
        return false;

    };

    ///////////////////////////////////////////////////////////////////////////
    // NEW CHANNEL STUFF
    ///////////////////////////////////////////////////////////////////////////

    // THIS IS WHEN A NEW CHANNEL IS CREATED
    document.querySelector('#newchannel').onclick = () =>
    {
        // promp fot new channel name
        var channelname = prompt("Add a new channel: ");

        if (channelname !== null){

            // Log the data on the console
            console.log(channelname);

            // send message to server
            socket.emit('newchannel', {
                'name': channelname,

            })

        }

    };






    //////////////////////////////////////////////////////////////////////////
    // WEB SOCKET ON DATA
    //////////////////////////////////////////////////////////////////////////

    // ON A NEW MESSAGE
    socket.on('message', data =>
    {

        // Create new item for list
        const li = document.createElement('li');

        // Add the message/date/usernate to item
        li.innerHTML = data.user + ' - ' + data.time + '<br>' + data.message + '<br>' + '<hr>' ;

        // Add new item to task list
        document.querySelector('#msgs').append(li);

        // scroll the page down
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);


    });

    // ON A NEW CHANNEL
    socket.on('channel', data =>
    {

        // Create new item for list
        const li = document.createElement('li');

        // Add the message/date/usernate to item
        li.innerHTML = '<a class="nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="false">'+data.name+'</a>';

        // Add new item to task list
        document.querySelector('#channels').append(li);

    });


    // WHEN RECEIVING A LIST OF CHANNELS
    socket.on('channels_list', data =>
    {
        // CLEAR CHANNLES FIRST
        document.querySelector('#channels').innerHTML = "";

        // Make a new list item for each channel
        for (let chanl of data) {

            // Create new item for list
            const li = document.createElement('li');

            // Add the message/date/usernate to item
            if (chanl == localStorage.getItem("channel")){
                li.innerHTML = '<a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="true">'+chanl+'</a>';
                //console.log(chanl);
                //console.log(localStorage.getItem("channel"));
            } else {
                li.innerHTML = '<a class="nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="false">'+chanl+'</a>';
            }


            // Add new item to task list
            document.querySelector('#channels').append(li);

            // MAKE A SELECTOR
            li.addEventListener("click", () => {
                //socket.emit('get_channels');
                localStorage.setItem("channel", chanl);
                socket.emit('get_channels');
                console.log('channel is: ', chanl)

                //socket.emit("get_mesages", { chanl });

            });

        }

    });

});
