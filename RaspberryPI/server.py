import socket
import boto3
import datetime
print("We're in tcp server...");


def create_question_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb',region_name='us-east-1')

    table = dynamodb.create_table(
        TableName='Questions',
        KeySchema=[
            {
                'AttributeName': 'userid',
                'KeyType': 'HASH'  # Partition key
            },
            {
                'AttributeName': 'date',
                'KeyType': 'RANGE'  # Sort key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'userid',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'date',
                'AttributeType': 'S'
            },

        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )
    return table

def put_question(user, date, question, answer, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

    table = dynamodb.Table('Questions')
    response = table.put_item(
       Item={
            'userid': user,
            'date': date,
            'info': {
                'question': question,
                'answer': answer
            }
        }
    )

    return response

def scan_questions(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

    table = dynamodb.Table('Questions')

    #scan and get the first page of results
    response = table.scan();
    print(response)

def now():
    time = datetime.datetime.now()
    time = time.strftime("%Y-%m-%d %H:%M:%S")
    return time

#create database

#q_table = create_question_table()
# now = datetime.datetime.now()
# now = now.strftime("%Y-%m-%d %H:%M:%S")
# put_question("sherif", now, "test q", "test r")

# print("printing table")
# scan_questions()



#select a server port
server_port = 12221
#create a TCP socket
welcome_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
#bind the server to the localhost at port server_port
welcome_socket.bind(('0.0.0.0',server_port))

#extra for tcp socket:
welcome_socket.listen(1)

#ready message
print('Server running on port ', server_port)
message = ""
connection_socket, caddr = welcome_socket.accept()
#Now the loop that actually listens from clients
while message != 'end':
    
    print("ready to receive messages")
    #notice recv and send instead of recvto and sendto
    message = connection_socket.recv(1024)
    message = message.decode()

    if message == 'question':
        connection_socket.send('ask'.encode())
        print('receiving question')
        question_pair = connection_socket.recv(1024)
        question_pair = question_pair.decode()
        user, question, answer = question_pair.split("|")
        print('question received')
        resp = put_question(user, now(), question, answer)
        print('question stored')

print('ending')
scan_questions()
        




    # connection_socket.send(answer.encode())