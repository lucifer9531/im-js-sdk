import Event from './event';
import { ICallback, OptionParam } from '@/interface/middleware';

/**
 * @class 中间件类
 * @description 用于处理消息处理中心，编解码
 */
export default class Middleware extends Event {
  public options: OptionParam = {
    onerror: () => {},
  };
  public middleware: ICallback[] = [];

  constructor(options?: object) {
    super();
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * 错误回调
   * @param err
   */
  onerror(err: any) {
    const msg = err.stack || err.toString();
    console.error(msg.replace(/^/gm, '  '));
    this.options.onerror(err);
  }

  /**
   * 注入中间件函数
   * @param {Function|Array} fn 中间件函数
   */
  use(fn: ICallback) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be function');
    this.middleware.push(fn);
  }

  /**
   * 批量注入中间件
   * @param {Array | ICallback} list  中间件列表
   */
  useBatch(list: ICallback[] = []) {
    list.forEach((fn) => {
      this.use(fn);
    });
  }
}
