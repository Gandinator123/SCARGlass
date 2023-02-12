from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests
from datetime import datetime
import threading
import socket
import psutil
import json

class handler(SimpleHTTPRequestHandler):
  def do_GET(self):
    self.send_response(200)
    self.send_header('Content-type','text/html')
    self.end_headers()

    message = "Hello, World! Here is a GET response"
    self.wfile.write(bytes(message, "utf8"))

  def do_POST(self):
    self.send_response(200)
    self.send_header('Content-type','text/html')
    self.end_headers()

    self.data_string = self.rfile.read(int(self.headers['Content-Length']))
    data = json.loads(self.data_string)
    print(data['id'])

    message = "Hello, World! Here is a POST response"
    self.wfile.write(bytes(message, "utf8"))

def server():
  httpd = HTTPServer(('0.0.0.0', 8000), handler)
  httpd.serve_forever()

def get_ip_address():
  info = dict()
  conns = psutil.net_if_stats()
  ifs = psutil.net_if_addrs()
  for conn, snicstats in conns.items():
      if snicstats.isup:
          connifs = ifs[conn]
          for connif in connifs:
              if str(connif.family.name) == 'AF_INET':
                  info[conn[:17]] = connif.address
  return info['wlan0']

s = threading.Thread(target=server)
s.start()

# httpd = HTTPServer(('0.0.0.0', 8000), handler)
# httpd.serve_forever()

url = 'http://54.234.70.84:8000/pairings/create/'

startTime = datetime.now()
sent = False
while True:
  currentTime = datetime.now()
  timeDelta = int((currentTime - startTime).total_seconds())
  if timeDelta % 10 == 0:
    if not sent:
      data = {
        'ip': get_ip_address(),
      }
      # response = requests.post(url, json=data)
      # print(response.text)
      sent = True
  elif sent:
    sent = False