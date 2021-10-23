function getBrowserInfo() {
  const userAgent = navigator.userAgent.toLowerCase();

  const browserTypes = {
    IE: /(?:msie|trident.*rv).([\d.]+)/,
    Edge: /edge.([\d.]+)/,
    Chrome: /chrome.([\d.]+)/,
    Firefox: /firefox.([\d.]+)/,
    Opera: /opera.([\d.]+)/,
    Safari: /(?:safari|version).([\d.]+)/,
  };
  type BrowserKeys = keyof typeof browserTypes;

  let type!: BrowserKeys | null;
  let version!: string | null;

  for (type in browserTypes) {
    if ((version = browserTypes[type as BrowserKeys].exec(userAgent) as any)) {
      version = version[1];
      break;
    }
  }

  if (version) {
    if (type === 'IE') {
      try {
        document.execCommand('BackgroundImageCache', false, true as any);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    type = version = null;
  }
  return { type, version };
}

// TODO 优化
function getOsInfo() {
  const userAgent = navigator?.userAgent.toLowerCase();
  let name = 'Unknown';
  let version = 'Unknown';
  if (userAgent.indexOf('win') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 5.0') > -1) {
      version = 'Windows 2000';
    } else if (
      userAgent.indexOf('windows nt 5.1') > -1 ||
      userAgent.indexOf('windows nt 5.2') > -1
    ) {
      version = 'Windows XP';
    } else if (userAgent.indexOf('windows nt 6.0') > -1) {
      version = 'Windows Vista';
    } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
      version = 'Windows 7';
    } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
      version = 'Windows 8';
    } else if (userAgent.indexOf('windows nt 6.3') > -1) {
      version = 'Windows 8.1';
    } else if (
      userAgent.indexOf('windows nt 6.2') > -1 ||
      userAgent.indexOf('windows nt 10.0') > -1
    ) {
      version = 'Windows 10';
    } else {
      version = 'Unknown';
    }
  } else if (userAgent.indexOf('iphone') > -1) {
    name = 'Iphone';
  } else if (userAgent.indexOf('mac') > -1) {
    name = 'Mac';
  } else if (
    userAgent.indexOf('x11') > -1 ||
    userAgent.indexOf('unix') > -1 ||
    userAgent.indexOf('sunname') > -1 ||
    userAgent.indexOf('bsd') > -1
  ) {
    name = 'Unix';
  } else if (userAgent.indexOf('linux') > -1) {
    if (userAgent.indexOf('android') > -1) {
      name = 'Android';
    } else {
      name = 'Linux';
    }
  } else {
    name = 'Unknown';
  }
  return { name, version };
}

const { type } = getBrowserInfo();
const { name } = getOsInfo();

export function getTerminalType() {
  return type;
}

export function getOptSystem() {
  return name;
}

export function isMobile() {
  const flag = navigator?.userAgent
    .toLowerCase()
    .match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    );
  return flag;
}
