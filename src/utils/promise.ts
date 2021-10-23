export const promiseMiddleware = (middlewares: any[], ctx: any) => {
  let promise = Promise.resolve(null);
  let next;

  // 绑定上下文到每个方法的this以及第一个参数
  middlewares.forEach((fn, i) => {
    middlewares[i] = fn.bind(null, ctx);
  });

  while ((next = middlewares.shift())) {
    promise = promise.then(next);
  }

  return promise.then(() => {
    return ctx;
  });
};
