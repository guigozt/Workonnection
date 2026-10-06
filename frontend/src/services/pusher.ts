import Pusher from 'pusher-js';

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY || 'c839db74ed8f268ea65c';
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'sa1';

let pusherInstance: Pusher | null = null;

export const getPusherClient = (): Pusher => {
  if (!pusherInstance) {
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });
  }
  return pusherInstance;
};
