import socket

#send question answer 


def client_program(qaPair):
    host = '54.234.70.84'  
    port = 12221  # socket server port number

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # instantiate
    client_socket.connect((host, port))  # connect to the server

    message = input(" -> ")  # take input

    while message.lower().strip() != 'end':

        if message == 'question':
            #get question/response pair of the form "user|question|answer"
            client_socket.send('question'.encode())
            client_socket.recv(1024)
            client_socket.send(qaPair.encode())
            #then send to DB somehow
            print('pair sent')

        if message == 'picture':
            #receive picture from camera 
            #store in DB
            pass



        #client_socket.send(message.encode())  # send message
        #data = client_socket.recv(1024).decode()  # receive response

        #print('Received from server: ' + data)  # show in terminal

        message = input(" -> ")  # again take input
    
    print('ending')
    client_socket.send('end'.encode())
    client_socket.close()  # close the connection



if __name__ == '__main__':
    qaPair = "sherifClient|question|answer"
    client_program(qaPair)