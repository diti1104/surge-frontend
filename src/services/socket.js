import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectSocket = (onMessage) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS('https://surge-backend-production-fa1c.up.railway.app/ws'),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ WebSocket Connected!');
      ['HIGH', 'MEDIUM', 'LOW'].forEach((zone) => {
        stompClient.subscribe(`/topic/surge/${zone}`, (msg) => {
          const value = parseFloat(msg.body);
          onMessage(zone, value);
        });
      });
    },
    onDisconnect: () => {
      console.log('❌ WebSocket Disconnected!');
    },
  });
  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.deactivate();
};