/*******************************************************************************


 __________________
|  ______________  |
| |        __    | |   _____ _            _
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
            alert("Please provide a username");
        }
        else
        {
            localStorage.setItem('username', username);
        }

    }


    ///////////////////////////////////////////////////////////////////////////
    // SET UP CHANNELS AND MESSAGES
    //////////////////////////////////////////////////////////////////////////

    // if no channel is selected
    if (localStorage.getItem("channel") == null)
    {

        // set up channel
        localStorage.setItem('channel', 'general');

        // ASK FOR THE LIST WITH CHANNELS
        socket.emit('get_channels');

        // ASK FOR MESSAGES INSIDE THE CHANNEL
        socket.emit('get_all_messages', {
            'name': localStorage.getItem("channel"),

        });

    }
    else
    {

        // ASK FOR THE LIST WITH CHANNELS
        socket.emit('get_channels');

        // ASK FOR MESSAGES INSIDE THE CHANNEL
        socket.emit('get_all_messages', {
            'channel': localStorage.getItem("channel"),
        });


    }


    ////////////////////////////////////////////////////////////////////////
    // SEND MESSAGES TO BACKEND AND FORM SUBMISSION CONTROL
    ////////////////////////////////////////////////////////////////////////

    // By default, submit button is disabled
    document.querySelector('#submit').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#message').onkeyup = () =>
    {
        if (document.querySelector('#message').value.length > 0)
        {
            document.querySelector('#submit').disabled = false;
        }
        else
        {
            document.querySelector('#submit').disabled = true;
        }

    };

    // THIS IS WHEN THE MESSAGE IS SUBMITTED
    document.querySelector('#form').onsubmit = () =>
    {

        //get message and date
        let text = document.querySelector('#message').value;
        let time = new Date();

        // send message to server
        socket.emit('newmessage', {
            'user': localStorage.getItem('username'),
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

        if (channelname !== null)
        {

            // send message to server
            socket.emit('new_channel', {
                'name': channelname,

            })

        }
        else
        {
            alert("Please provide a channel name!");
        }

    };


    //////////////////////////////////////////////////////////////////////////
    // WEB SOCKET ON DATA
    //////////////////////////////////////////////////////////////////////////

    // Get all messages of a channel
    socket.on('get_all_messages', data =>
    {

        for (let messages of data)
        {
            if (messages.user != null){


                // Create new item for list
                const li = document.createElement('li');

                // Add the message/date/usernate to item
                //li.innerHTML = messages.user + ' - ' + messages.time + '<br>' + messages.message + '<br>' + '<hr>' ;

                let user = '<span id="username">' + messages.user + '</span>'
                let time = '<span id="time">' + messages.time + '</span>'
                let br = document.createElement('br');
                let br2 = document.createElement('br');
                let hr = document.createElement('hr');
                let message = messages.message

                if (localStorage.getItem('username') == messages.user){
                    /// then this message was sent by the user

                    // create delete button
                    let del = document.createElement('button');
                    del.innerHTML = "delete";
                    del.setAttribute("id", "deletebutton");
                    del.addEventListener("click", function(){
                        var confirmation = confirm("are you sure muggle?");
                        if (confirmation == true){
                            li.innerHTML = '';

                            // send message to server
                            socket.emit('delete_message', {
                                'user': messages.user,
                                'message': message,
                                'channel': localStorage.getItem('channel'),
                                'time': messages.time,
                            });
                        }
                    });

                    // add all to li
                    li.innerHTML = user + '   ' + time;
                    li.appendChild(del);
                    li.appendChild(br);
                    li.append(message);
                    li.appendChild(br2);
                    li.appendChild(hr);

                }else{
                    // No delete button

                    // Add the message/date/usernate to item
                    li.innerHTML = user + '   ' + time + '<br>' + message + '<br>' + '<hr>';

                }


                // Add new item to task list
                document.querySelector('#msgs').append(li);



            }


        }

        // scroll the page down
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);


    });

    // ON A NEW MESSAGE
    socket.on('message', data =>
    {
        //console.log(data);

        if (data.channel == localStorage.getItem('channel')){

            // Create new item for list
            const li = document.createElement('li');

            let user = '<span id="username">' + data.user + '</span>'
            let time = '<span id="time">' + data.time + '</span>'
            let br = document.createElement('br');
            let br2 = document.createElement('br');
            let hr = document.createElement('hr');
            let message = data.message

            //checking
            if (localStorage.getItem('username') == data.user){
                // if message was sent by the user

                // create delete button
                let del = document.createElement('button');
                del.innerHTML = "delete";
                del.setAttribute("id", "deletebutton");
                del.addEventListener("click", function(){
                    var confirmation = confirm("are you sure muggle?");
                    if (confirmation == true){
                        li.innerHTML = '';

                        // send message to server
                        socket.emit('delete_message', {
                            'user': data.user,
                            'message': message,
                            'channel': localStorage.getItem('channel'),
                            'time': data.time,
                        });
                    }

                });

                // add all to li
                li.innerHTML = user + '   ' + time;
                li.appendChild(del);
                li.appendChild(br);
                li.append(message);
                li.appendChild(br2);
                li.appendChild(hr);



            }else{
                // No delete button

                // Add the message/date/usernate to item
                li.innerHTML = user + '   ' + time + '<br>' + message + '<br>' + '<hr>';

            }


            // Add the message/date/usernate to item
            //li.innerHTML = data.user + ' - ' + data.time + '<br>' + data.message + '<br>' + '<hr>';

            // Add new item to task list
            document.querySelector('#msgs').append(li);

            // scroll the page down
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);


        }


    });

    // IF A NEW CHANNEL IS CREATED
    socket.on('channel', data =>
    {

        // Create new item for list
        const li = document.createElement('li');

        // Add the message/date/usernate to item
        li.innerHTML = '<a class="nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="false">#'+data.name+'</a>';

        // Add new item to task list
        document.querySelector('#channels').append(li);

        // Store the new channel as selected channel
        localStorage.setItem("channel", data.name);

        //Change title
        document.querySelector('#header').innerHTML = "#" + data.name + "<hr>";

        // Clear messages list
        document.querySelector('#msgs').innerHTML = "";

        // Ask for a new list of channels
        socket.emit('get_channels');

        // ask for new messages
        socket.emit('get_all_messages', {
            'channel': localStorage.getItem("channel"),

        });

    });


    // WHEN RECEIVING A LIST OF CHANNELS
    socket.on('channels_list', data =>
    {
        // CLEAR CHANNLES FIRST
        document.querySelector('#channels').innerHTML = "";

        // Make a new list item for each channel
        for (let chanl of data)
        {

            // Create new item for list
            const li = document.createElement('li');

            // Add the message/date/username to item
            if (chanl == localStorage.getItem("channel"))
            {
                li.innerHTML = '<a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="true">#'+chanl+'</a>';
            }
            else
            {
                li.innerHTML = '<a class="nav-link" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-selected="false">#'+chanl+'</a>';
            }


            // Add new item to task list
            document.querySelector('#channels').append(li);

            // WHEN THE USER SELECTS A CHANNEL
            li.addEventListener("click", () =>
            {

                // Store the new channel selection
                localStorage.setItem("channel", chanl);

                // Clear messages list
                document.querySelector('#msgs').innerHTML = "";

                //Change title
                document.querySelector('#header').innerHTML = "#" + chanl + "<hr>";

                // Ask for a new list of channels
                socket.emit('get_channels');

                // ask for new messages
                socket.emit('get_all_messages', {
                    'channel': localStorage.getItem("channel"),

                });

            });

        }

    });

    socket.on('delete_message', data =>
    {

        // Create new item for list
        //const li = document.createElement('li');

        // Add the message/date/usernate to item
        //li.innerHTML = '';

        // Add new item to task list
        //document.querySelector('#channels').append(li);

        // Store the new channel as selected channel
        //localStorage.setItem("channel", data.name);

        //Change title
        //document.querySelector('#header').innerHTML = "#" + data.name + "<hr>";

        // Clear messages list
        //document.querySelector('#msgs').innerHTML = "";

        // Ask for a new list of channels
        //socket.emit('get_channels');
        //console.log(data);

        if (localStorage.getItem("channel") == data.channel){
            // clear the message list
            document.querySelector('#msgs').innerHTML = "";

            // ask messages (again)
            socket.emit('get_all_messages', {
                'channel': localStorage.getItem("channel"),

            });
        }


    });

});
