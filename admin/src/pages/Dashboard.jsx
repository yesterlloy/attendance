import React, { useEffect, useState } from 'react';
import { Table, Image, Card, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/admin/attendance');
      if (res.data.success) {
        setData(res.data.data);
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
    <div style={{ padding: '24px' }}>
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
    </div>
  );
};

export default Dashboard;
