document.addEventListener('DOMContentLoaded', () => {


    ///////////////////////////////////////////////////////////////////////////
    // WEB SOCKET ON CONNECT
    //////////////////////////////////////////////////////////////////////////

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () =>
    {

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
                'channel': 'general',
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

            // Log the data on the console
            console.log(channelname);

            // send message to server
            socket.emit('newchannel', {
                'name': channelname,

            });

        };



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        ///////////////////////////////////////////////////////////////////////////
        // GET A LIST OF CHANNELS AND MESSAGES INSIDE A CHANNEL
        //////////////////////////////////////////////////////////////////////////

        // ASK FOR THE LIST WITH CHANNELS
        socket.emit('get_channels');

        // ASK FOR MESSAGES INSIDE THE CHANNEL
        // NOT READY YET.....
        socket.emit('get_messages', {
            //'name': channelname,
        });



    });



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
        li.innerHTML = '<a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab">'+data.name+'</a>';

        // Add new item to task list
        document.querySelector('#channels').append(li);

    });


    // WHEN RECEIVING A LIST OF CHANNELS
    socket.on('channels_list', data =>
    {

        // Make a new list item for each channel
        for (let chanl of data) {

            // Create new item for list
            const li = document.createElement('li');

            // Add the message/date/usernate to item
            li.innerHTML = '<a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab">'+chanl+'</a>';

            // Add new item to task list
            document.querySelector('#channels').append(li);

        }

    });




});
