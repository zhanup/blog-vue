import axios from 'axios';

const authUrl = [
  '/update',
  '/delete',
  '/article/new',
  '/collect/new',
  '/upload'

]

export const request = (params) => {
  // 创建axios实例
  const instance = axios.create({
    baseURL: '/api',
    // timeout: 2000
  });

  // 请求拦截
  instance.interceptors.request.use(config => {
    const url = config.url;
    authUrl.forEach(item => {
      if (url.includes(item)) {
        config.headers['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
      }
    });
    return config;
  }, error => {
    return error;
  });

  // 响应拦截
  instance.interceptors.response.use(res => {
    return res.data;
  }, error => {
    return error;
  });

  return instance(params);
}