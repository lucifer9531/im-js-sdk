import WebSDK from '../src/platforms/web';

describe('WebSDK Test', () => {
  const sdk = new WebSDK({
    url: 'ws://127.0.0.1:8888',
  });
  // console.log(sdk);
  // 链接成功回调
  // it('onConnected', (done) => {
  //   sdk.onConnected((res) => {
  //     expect(res.status).toEqual('OPEN');
  //     done();
  //   });
  // });
  // 绑定用户
  it('onBindAccount', (done) => {
    const params = {
      account: 'test',
      user: '2',
      type: '1',
      landingPage: '4',
      dialogPage: '5',
      webType: '0',
      acceptType: '7',
      ipAddress: '9',
      terminal: '11',
      systemVersion: '21',
    };
    sdk.onBindAccount(params);
    done();
  });
  it('on and emit msg', (done) => {
    sdk.on('message', (obj) => {
      expect(obj).toEqual({ msg: 'message' });
      done();
    });
    sdk.emit('message', { msg: 'message' });
  });

  it('on', (done) => {
    sdk.on('wsResResult', (data) => {
      console.log(JSON.parse(data));
    });
    done();
  });

  // it('add middleware module', (done) => {
  //   sdk.useBatch([
  //     (ctx: any) => {
  //       ctx.message.content = 'test message';
  //     },
  //     (ctx: any) => {
  //       ctx.conversation.lastMsg = 'test message';
  //     },
  //   ]);
  //   sdk.dispatch({ type: 'text' }, { account: 'test' }).then((ctx) => {
  //     expect(ctx.message).toEqual({ type: 'text', content: 'test message' });
  //     expect(ctx.conversation).toEqual({ account: 'test', lastMsg: 'test message' });
  //     done();
  //   });
  // });
});
