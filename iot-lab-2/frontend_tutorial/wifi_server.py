import socket
import time
import picar_4wd as fc
import pickle
import json



HOST = "10.0.0.159" # IP address of your Raspberry PI
PORT = 65432          # Port to listen on (non-privileged ports are > 1023)

POWER = 0.5
TIME = 0.5 

dist = 0
dir = "Forward"

def forward():
    fc.forward(POWER)
    time.sleep(TIME)
    fc.stop()

def backward():
    fc.backward(POWER)
    time.sleep(TIME)
    fc.stop()

def left():
    fc.turn_left(POWER)
    time.sleep(TIME)
    fc.stop()

def right():
    fc.turn_right(POWER)
    time.sleep(TIME)
    fc.stop()

def get_summary_data():
    piread_dt = fc.pi_read()
    piread_dt['distance'] = dist
    piread_dt['direction'] = dir
    piread_dt['speed'] = POWER
    print(piread_dt)
    return piread_dt


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))
    s.listen()
    
    try:
        while 1:
            client, clientInfo = s.accept()
            print("server recv from: ", clientInfo)
            data = client.recv(1024)      # receive 1024 Bytes of message in binary format
            print(data)
            if data == b"38":
                dist += 1
                print('Going forward')
                dir = "Forward"
                forward()
            elif data == b"40":
                dist += 1
                dir = "Backward"
                print('Going backward')
                backward()
            elif data == b"37":
                dist += 1
                dir = "Left"
                print('Going left')
                left()
            elif data == b"39":
                dist += 1
                dir = "Right"
                print('Going right')
                right()
            elif data != b"info":
                print(data)     
                client.sendall(data)
                continue
            
            summ_data = get_summary_data()
            msg = json.dumps(summ_data)
            client.sendall(bytes(msg,encoding="utf-8")) # Echo back to client
            print('4')
    except: 
        print("Closing socket")
        client.close()
        s.close()    
     
