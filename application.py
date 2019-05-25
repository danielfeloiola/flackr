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

# Store channels and messages
channels = {"general": collections.deque([], maxlen=100)}


@app.route("/")
def index():
    '''Shows the home page'''

    return render_template("index.html")

@socketio.on("newmessage")
def msg(data):
    '''adds a new message'''

    channels[data['channel']].append(data)
    emit("message", data, broadcast=True)

@socketio.on("new_channel")
def new_channel(data):
    '''adds a new channel to the room'''

    if data['name'] in channels:
        return False
    else:
        name = data['name']
        channels[name] = collections.deque([], maxlen=100)
        emit("channel", data, broadcast=True)

@socketio.on('get_channels')
def get_channels():
    '''Sends a updated list of channels to user'''

    emit('channels_list', list(channels.keys()))

@socketio.on('get_all_messages')
def get_all_mesages(data):
    '''Sends all stored messages of a channel to the user'''

    channel = data['channel']
    emit('get_all_messages', list(channels[channel]))


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    #app.run()
