// import { useHeartBreak } from './useHeartBreak';
import { bindOptions, WebSocketOptions, WebSocketStatus } from '@/interface/ws';
import { wsResTypeEnum } from '../enums/wsResType';
import Middleware from './middleware';
import { promiseMiddleware } from '../utils/promise';

function resolveNestedOptions<T>(options: T | true): T {
  if (options === true) return {} as T;
  return options;
}

export default class ImJsSDK extends Middleware {
  public key = 'client_bind';
  public url;
  public immediate; // 是否立即初始化 ws 链接

  protected wsInstance: WebSocket | undefined;
  // 链接状态
  public status: WebSocketStatus = 'CONNECTING';
  public autoReconnect;
  public heartbeat;

  // 链接 ws成功回调
  protected onConnected;
  protected onDisconnected;
  protected onMessage;
  protected onError;

  // protected heartbeatPause: Fn | undefined;
  // protected heartbeatResume: Fn | undefined;
  protected heartbeatTimer;

  private explicitlyClosed = false;
  private retried = 0;

  protected bindOptions;

  private bufferedData: (string | ArrayBuffer | Blob)[] = [];

  constructor(config: Partial<WebSocketOptions> = {}) {
    super();
    const {
      url,
      onConnected,
      onDisconnected,
      onError,
      onMessage,
      heartbeat = true,
      autoReconnect = true,
      immediate = true,
    } = config;
    this.url = url;
    this.onConnected = onConnected;
    this.onDisconnected = onDisconnected;
    this.onError = onError;
    this.onMessage = onMessage;
    this.heartbeat = heartbeat;
    this.autoReconnect = autoReconnect;
    this.immediate = immediate;
    this.use(promiseMiddleware);
    this.immediateInit();
  }

  public close: WebSocket['close'] = (code, reason) => {
    if (!this.wsInstance) return;
    this.explicitlyClosed = true;
    // this.heartbeatPause?.();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.wsInstance.close(code, reason);
  };

  public open = () => {
    this.close();
    this.retried = 0;
    this.init();
  };

  public send = (data: string | ArrayBuffer | Blob, useBuffer = true) => {
    if (!this.wsInstance || this.status !== 'OPEN') {
      if (useBuffer) this.bufferedData.push(data);
      return false;
    }
    this.sendBuffer();
    this.wsInstance.send(data);
    return true;
  };

  protected init = () => {
    this.wsInstance = new WebSocket(this.url);
    this.status = 'CONNECTING';
    this.explicitlyClosed = false;

    this.wsInstance.onopen = () => {
      this.status = 'OPEN';
      this.onConnected?.(this.wsInstance!);
      // this.heartbeatResume?.();
      this._heartbeat();
      this.sendBuffer();
    };

    this.wsInstance.onclose = (ev) => {
      this.status = 'CLOSED';
      this.wsInstance = undefined;
      this.onDisconnected?.(this.wsInstance, ev);

      if (!this.explicitlyClosed && this.autoReconnect) {
        const { retries = -1, delay = 1000, onFailed } = resolveNestedOptions(this.autoReconnect);
        this.retried += 1;
        if (retries < 0 || this.retried < retries) {
          setTimeout(() => {
            this.init();
            const options = this.onReconnect();
            this.onBindAccount(options);
          }, delay);
        } else onFailed?.();
      }
    };

    this.wsInstance.onerror = (e) => {
      this.onError?.(this.wsInstance!, e);
    };

    this.wsInstance.onmessage = (e: MessageEvent) => {
      this.emit(wsResTypeEnum.WS_RES_RESULT, e.data);
      this.onMessage?.(this.wsInstance!, e);
    };
  };

  protected onReconnect = (cacheOptions?: bindOptions) => {
    return this.bindOptions ?? cacheOptions;
  };

  protected sendBuffer = () => {
    if (this.bufferedData.length && this.wsInstance && this.status === 'OPEN') {
      for (const buffer of this.bufferedData) this.wsInstance.send(buffer);
      this.bufferedData = [];
    }
  };

  protected _heartbeat = () => {
    if (this.heartbeat) {
      const { message = { key: 'heartbeat', data: { heartbeat: 'ping' } }, interval = 5000 } =
        resolveNestedOptions(this.heartbeat);
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => {
        this.send(JSON.stringify(message), false);
      }, interval);
      // const { pause, resume } = useHeartBreak(
      //   () => this.send(JSON.stringify(message), true),
      //   interval,
      //   {
      //     immediate: false,
      //   }
      // );
      // this.heartbeatPause = pause;
      // this.heartbeatResume = resume;
    }
  };

  protected immediateInit = () => {
    if (this.immediate) this.init();
  };

  protected onBindAccount(options: bindOptions) {
    this.bindOptions = options;
    const { account, user, type = '1' } = options;
    const tempAccountOptions = {
      key: this.key,
      data: {
        account,
        user,
        type,
      },
    };
    this.send(JSON.stringify(tempAccountOptions));
  }
}
