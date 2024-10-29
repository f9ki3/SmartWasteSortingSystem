from flask import Flask, redirect, render_template,request,jsonify,session
from account import *
import os

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/user')
def user():
    return render_template('user.html')

    
if __name__ == "__main__":
    app.run(debug=True)