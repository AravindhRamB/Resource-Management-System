import React, { useState, useMemo } from 'react';
import { Table, Input, Button, Space, message, Tag } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {DynamicTableProps} from '@/module/component'



const DynamicTable: React.FC<DynamicTableProps> = ({
  data = [],
  onAccept,
  onReject,
  loading = false,
  pagination = { pageSize: 10, showSizeChanger: true, showQuickJumper: true },
  size = 'middle',
  scroll
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Generate columns dynamically based on data structure
  const columns: ColumnsType<any> = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sampleRecord = data[0];
    const dynamicColumns: ColumnsType<any> = [];

    // Generate columns for each key in the data
    Object.keys(sampleRecord).forEach((key) => {
      // Skip 'action' key as we'll handle it separately
      if (key.toLowerCase() === 'action') return;

      const column: any = {
        title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        dataIndex: key,
        key: key,
        sorter: (a: any, b: any) => {
          const aVal = a[key];
          const bVal = b[key];
          
          // Handle different data types for sorting
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal);
          }
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return aVal - bVal;
          }
          if (aVal instanceof Date && bVal instanceof Date) {
            return aVal.getTime() - bVal.getTime();
          }
          return String(aVal).localeCompare(String(bVal));
        },
        render: (text: any) => {
          // Handle different data types for display
          if (typeof text === 'boolean') {
            return <Tag color={text ? 'green' : 'red'}>{text ? 'Yes' : 'No'}</Tag>;
          }
          if (text instanceof Date) {
            return text.toLocaleDateString();
          }
          if (typeof text === 'object' && text !== null) {
            return JSON.stringify(text);
          }
          return text;
        }
      };

    // Add search functionality for 'name' and 'designation' columns only
    if (key.toLowerCase() === 'name' || key.toLowerCase() === 'designation') {
      column.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${key}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      );
      column.filterIcon = (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      );
      column.onFilter = (value: string, record: any) =>
        record[key]
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
    }

      dynamicColumns.push(column);
    });

    // Add action column if action property exists in data or if accept/reject handlers are provided
    const hasActionColumn = data.some(item => item.hasOwnProperty('action')) || (onAccept || onReject);
    
    if (hasActionColumn) {
      dynamicColumns.push({
        title: 'Action',
        key: 'action',
        fixed: 'right',
        width: 150,
        render: (_, record, index) => (
          <Space size="small">
            {onAccept && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => {
                  onAccept(record, index);
                  message.success('Action accepted');
                }}
              >
                Accept
              </Button>
            )}
            {onReject && (
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  onReject(record, index);
                  message.success('Action rejected');
                }}
              >
                Reject
              </Button>
            )}
          </Space>
        ),
      });
    }

    return dynamicColumns;
  }, [data, onAccept, onReject]);

  // Global search functionality
  const handleGlobalSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter((item) => {
      return Object.keys(item).some((key) => {
        const fieldValue = item[key];
        return fieldValue
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
    setFilteredData(filtered);
  };

  // Update filtered data when original data changes
  React.useEffect(() => {
    if (searchText) {
      handleGlobalSearch(searchText);
    } else {
      setFilteredData(data);
    }
  }, [data, searchText]);

  return (
    <div style={{ width: '100%' }}>
      {/* Global Search */}
      {/* <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search all columns..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleGlobalSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div> */}

      {/* Dynamic Table */}
      <Table
        columns={columns}
        dataSource={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
        loading={loading}
        pagination={pagination}
        size={size}
        scroll={scroll}
        bordered
        showSorterTooltip={false}
      />
    </div>
  );
};

export default DynamicTable;

