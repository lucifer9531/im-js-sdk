import { isArray, isString } from './judgment';
import { buildUUID } from './uuid';

interface EachObject {
  [key: string]: any;
  readonly length?: number;
}

interface JSONPOptions {
  url: string;
  data?: EachObject;
  timestamp?: boolean;
  timeout?: number;
  jsonName?: string;
  jsonpCallback?: string;
  charset?: string;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

function forEach(
  obj: EachObject,
  iterator: (value?: any, key?: number | string, obj?: EachObject) => boolean | void,
  context?: Object
) {
  if (!obj) return;
  if (obj.length && obj.length === +obj.length) {
    for (let i = 0; i < obj.length; i++) {
      if (iterator.call(context, obj[i], i, obj) === true) return;
    }
  } else {
    for (const k in obj) {
      if (hasOwnProperty.call(obj, k)) {
        if (iterator.call(context, obj[k], k, obj) === true) return;
      }
    }
  }
}

// Object to queryString
function serialize(obj: EachObject): string {
  const q: string[] = [];
  forEach(obj, (val, key) => {
    if (isArray(val)) {
      forEach(val, (v) => {
        q.push(`${key}=${encodeURIComponent(v)}`);
      });
    } else {
      q.push(`${key}=${encodeURIComponent(val)}`);
    }
  });
  return q.join('&');
}

const ie678 = eval('!-[1,]');
const head = document.head || document.getElementsByTagName('head')[0];
function jsonpCore(options): Promise<any> {
  return new Promise((resolve, reject) => {
    let { url } = <JSONPOptions>options;
    const {
      data = {},
      timestamp = false,
      timeout = 1000 * 30,
      jsonName = 'callback',
      jsonpCallback = 'jsonp_' + buildUUID(),
      charset,
    } = <JSONPOptions>options;
    let script: any = document.createElement('script');
    let done = false;
    function callback(isSuc = false) {
      if (isSuc) done = true;
      else reject(new Error('network error.'));
      script.onload = script.onerror = (<any>script).onreadystatechange = null;
      if (head && script.parentNode) {
        head.removeChild(script);
        script = null;
        window[jsonpCallback] = undefined;
      }
    }
    function fixOnerror() {
      setTimeout(() => {
        if (!done) callback();
      }, timeout);
    }
    if (ie678) {
      (<any>script).onreadystatechange = function () {
        const readyState = this.readyState;
        if (!done && (readyState == 'loaded' || readyState == 'complete')) callback(true);
      };
    } else {
      script.onload = function () {
        callback(true);
      };
      script.onerror = function () {
        callback();
      };
      if ((<any>window).opera) {
        fixOnerror();
      }
    }
    if (charset) script.charset = charset;
    const search = serialize({
      ...data,
      [jsonName]: jsonpCallback,
    });
    url += (url.indexOf('?') === -1 ? '?' : '&') + search;
    if (timestamp) url += `&ts=${new Date().getTime()}`;
    window[jsonpCallback] = function (json) {
      resolve(json);
    };
    script.src = url;
    head.insertBefore(script, head.firstChild);
  });
}

function jsonp(url: string): Promise<any>;

function jsonp(opt: JSONPOptions): Promise<any>;

function jsonp(opt): Promise<any> {
  if (isString(opt)) opt = { url: opt };
  return jsonpCore(opt);
}

export { jsonp };
