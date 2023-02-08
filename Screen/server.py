from http.server import HTTPServer, SimpleHTTPRequestHandler
import logging

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

    message = "Hello, World! Here is a POST response"
    self.wfile.write(bytes(message, "utf8"))

httpd = HTTPServer(('127.0.0.1', 8000), handler)
httpd.serve_forever()