import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { post } from '../service/fetch';

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 使用真实的登录API
      const res = await post('/admin/login', values);
      
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        message.success('登录成功！');
        onLoginSuccess && onLoginSuccess();
      } else {
        message.error(res.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>考勤管理系统</Title>
          <p style={{ color: '#666' }}>请使用管理员账号登录</p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" htmlType="submit" loading={loading} size="large" block>
                登录
              </Button>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>
                演示账号：admin / admin123
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;