from flask import Flask, redirect, render_template,request,jsonify,session
from account import *
import os

app = Flask(__name__)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/admin-home')
def user():
    return render_template('admin.html')

    
if __name__ == "__main__":
    app.run(debug=True)