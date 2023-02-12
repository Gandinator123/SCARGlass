from http.server import SimpleHTTPRequestHandler
import requests
from datetime import datetime
import threading
import socket
import psutil
import json

def make_handler(screen):
  class Handler(SimpleHTTPRequestHandler):
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
      
      # save to file
      with open("screen_config.txt", "w") as myfile:
        myfile.write("screen=" + str(data['id']))
      screen.screen_id = str(data['id'])
      screen.global_state = -1

      message = "Hello, World! Here is a POST response"
      self.wfile.write(bytes(message, "utf8"))

  return Handler

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
