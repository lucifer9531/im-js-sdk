export type WebSocketStatus = 'OPEN' | 'CONNECTING' | 'CLOSED';

export interface WebSocketOptions {
  // ws的链接
  url: string;
  onConnected?: (ws: WebSocket) => void;
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void;
  onError?: (ws: WebSocket, event: Event) => void;
  onMessage?: (ws: WebSocket, event: MessageEvent) => void;
  heartbeat?:
    | boolean
    | {
        message?: string;
        interval?: number;
      };
  autoReconnect?:
    | boolean
    | {
        retries?: number;
        delay?: number;
        onFailed?: Fn;
      };
  immediate?: boolean;
}

export interface bindOptions {
  // 账户信息
  account: string;
  // 用戶标识
  user: string;
  type?: string;
}
