using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;

namespace WebSocketServer.Middleware
{
    public class WebSocketServerConnectionManager
    {
        private ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        public string AddSocket(WebSocket socket)
        {
            //string ConnID = Guid.NewGuid().ToString();
            string ConnID = System.Security.Principal.WindowsIdentity.GetCurrent().Name;
            if (ConnID.Contains('\\'))
            {
                ConnID = ConnID.Split('\\')[1];
            }
            foreach (var sock in _sockets)
            {
                if (sock.Key.ToString() == ConnID)
                    ConnID = Guid.NewGuid().ToString();
            }
            _sockets.TryAdd(ConnID, socket);
            Console.WriteLine("WebSocketServerConnectionManager-> AddSocket: WebSocket added with ID: " + ConnID);
            return ConnID;
        }

        public ConcurrentDictionary<string, WebSocket> GetAllSockets()
        {
            return _sockets;
        }
    }
}
