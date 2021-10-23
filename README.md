# customer-service-im-js-sdk

customer-service-im-js-sdk 是一个 WebSocket 的二次封装，配合 UI 进行使用

## 功能

- 提供安全、稳定、合规的私有化即时通信 IM 服务
- 支持微信、小程序、WEB、APP 接入
- 集成 UI 组件，提供直接使用的聊天室
- 提供消息及 UI 的灵活配置

## 目录结构
```
├─ example                    # 使用用例
│   ├─ vue-demo               # npm方式引入的使用
│   └─ index.html             # umd方式引入的使用
│─ server                     # websocket后台服务
├─ src                        # 项目源代码
│   ├─ core                   # 核心代码
│   │   ├─ event.ts           # eventEmitter
│   │   └─ index.ts           # websocket二次封装
│   │   └─ middleware.ts      # 中间件
│   │   └─ useHeartBreak.ts   # 心跳发送自定义hook
│   ├─ enums                  # 枚举
│   ├─ interface              # 接口
│   ├─ platforms              # 分平台管理
│   ├─ utils                  # 工具类
│   └─index.js                # 源码入口
├── test                      # 测试用例
├── types                     # 全局typescript的类型定义
├── .npmrc                    # npm配置
├── commitlint.config.js      # 提交规范配置
├── LICENSE                   # 证书
├── lintstagedrc.js           # git提交语法检测
└── package.json              # package.json
└── tsconfig.json             # tsconfig.json

```


## Install
```bash
npm install customer-service-im-js-sdk -S

yarn add customer-service-im-js-sdk -S
```

## Node
Node.js >= 8.0.0 required. You can use 4.x in Node.js < 8.

## Node Usage

### Basic usage
1.install SDK using npm or yarn
```bash
yarn add customer-service-im-js-sdk -S
```
2.for example:
```javascript
// 引入
import WebSDK from "customer-service-im-js-sdk";

// 初始化sdk
const webSDK = new WebSDK({
  url: 'ws://xxxxx'
});

// 绑定账户
webSDK.onBindAccount({
  user: 'admin',
  account: 'W00000000018',
  landingPage: 'w2222222',
  acceptType: '333333',
});

// 发送消息 可发送的类型 string | ArrayBuffer | Blob
webSDK.send();

// 接收消息
webSDK.on('wsResResult', data => {
  console.log(JSON.parse(data));
  // ...
})

// 关闭ws连接
webSDK.close();
webSDK = null;

// 打开连接
webSDK.open();
```

## Browser Usage
You can use most of the functionalities of `customer-service-im-js-sdk` in browser with some exceptions:
- put object with streaming: no chunked encoding, we use multipart upload instead
- get object to local file: we cannot manipulate file system in browser, we provide signed object url for downloading needs

### Compatibility
- IE >= 10 & Edge
- Major versions of Chrome/Firefox/Safari
- Major versions of Android/iOS/WP
> Note: Because some browsers do not support promises, you need to introduce promise compatible libraries.
For example: IE10 and IE11 need to introduce a promise-polyfill.

### Basic usage
Include the sdk lib in the `<script>` tag and you have SDK available for creating client.

```bash
 <script src="../dist/websdk.umd.production.min.js"></script>

<script>

  // 初始化SDK
  const webSDK = new window.websdk.default({
    url: 'ws://mk-xx.xxxx.com/ws-xxx-web',
  });
  
  // 绑定账户
  webSDK.onBindAccount({
    user: 'admin',
    account: 'W00000000018',
    landingPage: 'w2222222',
    acceptType: '333333',
  });

  // 发送消息 可发送的类型 string | ArrayBuffer | Blob
  webSDK.send();

  // 接收消息
  webSDK.on('wsResResult', data => {
    console.log(JSON.parse(data));
    // ...
  })

  // 关闭ws连接
  webSDK.close();
  webSDK = null;

  // 打开连接
  webSDK.open();
</script>
```

## 维护者
IRIS
