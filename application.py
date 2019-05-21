import os
import requests
import collections

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

#Session(app)
#users = {}
channels = {"general": collections.deque([], maxlen=100)}
#channels = {}
#messages = []
#votes = {"yes": 0, "no": 0, "maybe": 0}

@app.route("/")
def index():
    '''Shows the home page'''
    return render_template("index.html") # messages=messages ou channels=channels


# change this to store messages and channels
@socketio.on("newmessage")
def msg(data):
    '''adds a new message'''

    channels[data['channel']].append(data)
    print(data)
    print(channels)
    emit("message", data, broadcast=True)

@socketio.on("newchannel")
def channel(data):
    '''adds a new channel to the room'''

    if data['name'] in channels:
        return False
    else:
        name = data['name']
        print(data)
        channels[name] = collections.deque([], maxlen=100)
        emit("channel", data, broadcast=True) # check this!!!!!!!!!!!!

@socketio.on('get_channels')
def get_channels():
    emit('channels_list', list(channels.keys()))

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #app.run()
