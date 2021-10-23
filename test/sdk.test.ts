import ImJsSDK from '../src/index';

describe('SDK Test', () => {
  const sdk = new ImJsSDK({
    url: 'ws://127.0.0.1:8989',
  });
  // console.log(sdk);
  it('on and emit msg', (done) => {
    sdk.on('message', (obj) => {
      expect(obj).toEqual({ msg: 'message' });
      done();
    });
    sdk.emit('message', { msg: 'message' });
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
