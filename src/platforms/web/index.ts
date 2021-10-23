import ImJsSDK from '../../core';
import { getOptSystem, getTerminalType, isMobile } from '../../utils/browser';

interface bindOptions {
  account: string;
  user: string;
  type?: string;
  landingPage?: string;
  acceptType?: string;
  ipAddress?: string;
  address?: string;
}

export default class WebSDK extends ImJsSDK {
  public key = 'client_bind';
  protected baseOptions;

  constructor(config) {
    super(config);
  }

  public onBindAccount(options: bindOptions) {
    this.bindOptions = options;
    this._initOptions(options);
    const requestOptions = {
      key: this.key,
      data: { ...this.baseOptions },
    };
    this.send(JSON.stringify(requestOptions));
  }

  private _initOptions(options: Partial<bindOptions> = {}) {
    const deviceInfo = WebSDK._initDevice();
    this.baseOptions = Object.assign(
      {
        dialogPage: window.location.href,
      },
      options,
      deviceInfo
    );
  }

  private static _initDevice() {
    return {
      webType: isMobile() ? '1' : '0',
      terminal: getTerminalType(),
      systemVersion: getOptSystem(),
    };
  }
}
