import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3000', // API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    let messageText = '请求失败';
    if (error.response) {
      const { status, data } = error.response;
      messageText = data.message || `请求失败 (${status})`;
      
      // 处理401未授权
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      messageText = '网络错误，无法连接服务器';
    } else {
      messageText = error.message;
    }
    
    message.error(messageText);
    return Promise.reject(error);
  }
);

// 封装get方法
export const get = (url, params = {}) => {
  return request.get(url, { params });
};

// 封装post方法
export const post = (url, data = {}) => {
  return request.post(url, data);
};

export default request;
