import React, { useEffect, useState } from 'react';
import { Table, Image, Card, Typography, Button, Space, message, Layout } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { get } from '../service/fetch';

const { Title } = Typography;
const { Header, Content } = Layout;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 获取当前登录用户
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await get('/api/admin/attendance');
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // 登出功能
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('登出成功');
    // 重定向到登录页面
    window.location.href = '/login';
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <span>
          {record.address || `${record.latitude}, ${record.longitude}`}
        </span>
      ),
    },
    {
      title: 'Photo',
      dataIndex: 'image_path',
      key: 'image_path',
      render: (text) => (
        text ? (
          <Image
            width={100}
            src={`http://localhost:3000${text}`}
            alt="Attendance"
          />
        ) : 'No Image'
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>考勤管理系统</Title>
        <Space>
          {currentUser && <span>欢迎，{currentUser.username}</span>}
          <Button
            type="default"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            登出
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: 24, background: '#f0f2f5' }}>
        <Card>
          <Title level={2}>Attendance Records</Title>
          <Table
            dataSource={data}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Dashboard;