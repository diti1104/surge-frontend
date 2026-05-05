import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectSocket = (onMessage) => {
  stompClient = new Client({
    brokerURL: 'wss://surge-backend-production-fa1c.up.railway.app/ws',
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('✅ WebSocket Connected!');
      ['HIGH', 'MEDIUM', 'LOW'].forEach((zone) => {
        stompClient.subscribe(`/topic/surge/${zone}`, (msg) => {
          console.log(`📨 Zone: ${zone}, Value: ${msg.body}`);
          const value = parseFloat(msg.body);
          onMessage(zone, value);
        });
      });
    },
    onDisconnect: () => {
      console.log('❌ WebSocket Disconnected!');
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error', frame);
    },
  });
  stompClient.activate();
};

export const disconnectSocket = () => {
  if (stompClient) stompClient.deactivate();
};