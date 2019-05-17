import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

#Session(app)
users = {}
channels = {}
messages = []
votes = {"yes": 0, "no": 0, "maybe": 0}

@app.route("/")
def index():
    '''Shows the home page'''
    return render_template("index.html", votes=votes) # messages=messages


# change this to store messages and channels
@socketio.on("newmessage")
def msg(data):
    print(data)
    #selection = data["selection"]
    #votes[selection] += 1
    #emit("vote totals", votes, broadcast=True)
    messages.append(data)
    #print(messages)
    #emit("messages", messages, broadcast=True)
    emit("messages", data, broadcast=True)

if __name__ == '__main__':
    app.run()
