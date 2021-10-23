import { jsonp } from './jsonp';

/**
 * 获取公网ip地址 异步
 */
export async function getLocation() {
  // dev: PECBZ-PXKCQ-4N65N-GF373-TEFVV-SLFGN
  // pro: SKDBZ-TLLCD-TNY4S-PVRAD-TMPIF-YBBLK
  const key =
    process.env.NODE_ENV === 'development'
      ? 'PECBZ-PXKCQ-4N65N-GF373-TEFVV-SLFGN'
      : 'SKDBZ-TLLCD-TNY4S-PVRAD-TMPIF-YBBLK';

  return await jsonp(`https://apis.map.qq.com/ws/location/v1/ip?key=${key}&output=jsonp`);
}
