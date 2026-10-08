"""Serves the Claude Design mirror for tests/parity.spec.ts.

The reference page fetches ~70 .jsx files at once; the stock http.server's 5-slot listen
queue resets some of those connections, so use a threaded server with a deep queue.
"""
import functools
import http.server
import sys

ROOT = "docs/reference/optimus-design"


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 256
    daemon_threads = True


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8791
Server(("127.0.0.1", port), functools.partial(Quiet, directory=ROOT)).serve_forever()
