from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_socketio import SocketIO, emit
import os, threading
import serial
import win32com.client
import time
from data_logs import *

app = Flask(__name__)
socketio = SocketIO(app)

# Initialize serial communication with Arduino (change the port if necessary)
try:
    arduino = serial.Serial('COM21', 9600, timeout=1)
    print("Successfully connected to the Arduino!")
except serial.SerialException as e:
    print(f"Error: {e}")
    
# Global variables for each data endpoint
data_requested = False
current_trash_count = 0
reset_timer = None

data_requested2 = False
current_trash_count2 = 0
reset_timer2 = None

data_requested3 = False
current_trash_count3 = 0
reset_timer3 = None

data_requested4 = False
current_trash_count4 = 0
reset_timer4 = None

# Function to reset the status of each microcontroller
def reset_data_requested():
    global data_requested, data_requested2, data_requested3, data_requested4
    print("Microcontrollers have not sent data recently. Marking them as 'off'.")
    data_requested = False
    data_requested2 = False
    data_requested3 = False
    data_requested4 = False

# Route to receive data from the first microcontroller
@app.route('/data', methods=['POST'])
def receive_data():
    global current_trash_count, data_requested, reset_timer
    if reset_timer:
        reset_timer.cancel()
    data_requested = True
    reset_timer = threading.Timer(30.0, reset_data_requested)
    reset_timer.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count = distance
    socketio.emit('updateTrash', {'count': current_trash_count})
    print(f"Distance from microcontroller 1: {distance}")
    return jsonify({"status": "success", "distance": distance}), 200

# Route to receive data from the second microcontroller
@app.route('/data2', methods=['POST'])
def receive_data2():
    global current_trash_count2, data_requested2, reset_timer2
    if reset_timer2:
        reset_timer2.cancel()
    data_requested2 = True
    reset_timer2 = threading.Timer(30.0, reset_data_requested)
    reset_timer2.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count2 = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count2 = distance
    socketio.emit('updateTrash2', {'count': current_trash_count2})
    print(f"Distance from microcontroller 2: {distance}")
    return jsonify({"status": "success", "distance": distance}), 200

# Route to receive data from the third microcontroller
@app.route('/data3', methods=['POST'])
def receive_data3():
    global current_trash_count3, data_requested3, reset_timer3
    if reset_timer3:
        reset_timer3.cancel()
    data_requested3 = True
    reset_timer3 = threading.Timer(30.0, reset_data_requested)
    reset_timer3.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count3 = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count3 = distance
    socketio.emit('updateTrash3', {'count': current_trash_count3})
    print(f"Distance from microcontroller 3: {distance}")
    return jsonify({"status": "success", "distance": distance}), 200

# Route to receive data from the fourth microcontroller
@app.route('/data4', methods=['POST'])
def receive_data4():
    global current_trash_count4, data_requested4, reset_timer4
    if reset_timer4:
        reset_timer4.cancel()
    data_requested4 = True
    reset_timer4 = threading.Timer(30.0, reset_data_requested)
    reset_timer4.start()

    data = request.json
    if data is None or 'distance' not in data:
        current_trash_count4 = 404
        return jsonify({"status": "error", "message": "Invalid data"}), 400
    
    distance = int(data.get('distance', 0))
    current_trash_count4 = distance
    socketio.emit('updateTrash4', {'count': current_trash_count4})
    print(f"Distance from microcontroller 4: {distance}")
    return jsonify({"status": "success", "distance": distance}), 200

# Routes to check the status of each microcontroller
@app.route('/check_status', methods=['GET'])
def check_status():
    return jsonify({"status": "on" if data_requested else "off"}), 200

@app.route('/check_status2', methods=['GET'])
def check_status2():
    return jsonify({"status": "on" if data_requested2 else "off"}), 200

@app.route('/check_status3', methods=['GET'])
def check_status3():
    return jsonify({"status": "on" if data_requested3 else "off"}), 200

@app.route('/check_status4', methods=['GET'])
def check_status4():
    return jsonify({"status": "on" if data_requested4 else "off"}), 200

# Authentication and user routes
@app.route('/')
def login():
    return render_template('login.html')

@app.route('/logout')
def logout():
    return redirect('/')

@app.route('/admin-home')
def user():
    return render_template('admin.html')

@app.route('/getAllData')
def getAllData():
    data = get_all_records()
    return jsonify(data)

@app.route('/sendDataArduino', methods=['POST'])
def sendDataArduino():
    input_data = request.form.get('data')  # Get data from the form (or AJAX)
    if input_data:
        # Send the data to Arduino via serial
        arduino.write(input_data.encode())  # Send string to Arduino

        # Wait for Arduino to process the data
        time.sleep(2)  # Sleep for 2 seconds to allow Arduino to react
    
        # Optionally, you can read response from Arduino (if needed)
        response = arduino.readline().decode('utf-8').strip()

        insert_data(input_data)

        # Send a JSON response back to the client
        return jsonify({'success': True, 'message': 'Data sent to Arduino', 'data': input_data, 'arduino_response': response})
    else:
        return jsonify({'success': False, 'message': 'No data received'})

@app.route('/collect_trash', methods=['POST'])
def collect_trash():
    data = request.get_json()
    trash_type = data.get('trash_type')
    
    if trash_type:
        insert_collect_trash(trash_type)
        # Logic to handle the collected trash, e.g., saving to a database or processing it
        print(f"Collected {trash_type}")
        return jsonify({"message": f"Successfully collected {trash_type}."}), 200
    else:
        return jsonify({"message": "No trash type selected."}), 400

@app.route('/retrieve_trash', methods=['GET'])
def retrieve_trash():
    data = retrieve_trashT()
    return jsonify(data)

@app.route('/retrieved_recycle', methods=['GET'])
def retrievedRecycle():
    data = retrieved_recycle()  # Call the function once to get the data
    return jsonify(data)  # Return the data as a JSON response

if __name__ == "__main__":
    socketio.run(app,host="0.0.0.0", debug=True)
