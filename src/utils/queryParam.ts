export const getQueryParam = (qs: string) => {
  qs = qs.split('+').join(' ');
  const params: any = {};
  let tokens;
  const re = /[?&]?([^=]+)=([^&]*)/g;
  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
};

export const getQueryParamByName = (url: string, name: string) => {
  if (!url) url = location && location.search;
  const match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};
