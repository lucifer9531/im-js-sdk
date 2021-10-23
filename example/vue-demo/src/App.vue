<template>
  <div>
    <el-input
      v-model="inputValue"
      placeholder="placeholder"
      type="textarea"
      size="medium"
      style="width: 70%"
    />
    <el-button type="primary" @click="handleSend">发送</el-button>
    <el-button type="primary" @click="handleOpen">打开</el-button>
    <el-button type="primary" @click="handleClose">关闭</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import WebSDK from '../../../src/platforms/web';

export default defineComponent({
  name: 'App',
  setup() {
    const state = reactive({
      inputValue: '',
    });
    // let params = {
    //   key: 'client_bind',
    //   data: {
    //     account: '432534643', // 用户信息，appKey兑换
    //     type: '1', // 默认为客户 传1
    //     user: '182.150.56.30', // appKey兑换 | 未登录传IP
    //     landingPage: 'http://www.baidu.com', // 三方页面
    //     dialogPage: 'https://kf-im-dev.dustess.com/chat', // 聊天窗口页面
    //     webType: '45354364', // 接入渠道 0-桌面网站 1-移动网站
    //     acceptType: '42436543646', // 接入方式 0-网页组件 1-聊天链接
    //     ipAddress: '182.150.56.30',
    //     terminal: browserInfo.terminal!,
    //     systemVersion: browserInfo.optSystem!,
    //   },
    // };
    const webSDK = new WebSDK({
      url: 'ws://mk-dev.dustess.com/ws-kf-web',
      // url: 'ws://172.254.1.165:8063',
    });
    // const webSDK1 = new WebSDK({
    //   url: 'ws://mk-dev.dustess.com/ws-kf-web',
    // });

    // console.log(webSDK === webSDK1);
    webSDK.onBindAccount({
      account: 'W00000000018',
      type: '0',
      user: '',
      landingPage: 'http://www.baidu.com',
      ipAddress: '183.33.22.22',
      address: '测试',
      acceptType: '0', // 接入方式
      // webType: '0' // 接入渠道
    });

    webSDK.on('wsResResult', (data: string) => {
      console.log(JSON.parse(data));
    })

    const handleSend = () => {
      // imJsSDK.send(state.inputValue);
      // state.inputValue = '';
    };

    const handleOpen = () => {
      webSDK.open();
    }

    const handleClose = () => {
      webSDK.close();
      // webSDK = null;
    }

    return {
      webSDK,
      ...toRefs(state),
      handleSend,
      handleOpen,
      handleClose
    };
  },
});
</script>
