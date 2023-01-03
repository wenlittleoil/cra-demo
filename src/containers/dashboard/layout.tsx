
import { 
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  SettingOutlined,
  MoreOutlined,
  FileOutlined,
  TeamOutlined,
  RocketOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { 
  MenuProps,
} from 'antd';
import { Layout, Menu } from 'antd';
import React, { useState, PropsWithChildren, } from 'react';
import './layout.scss';

const { Header, Sider, Content } = Layout;

interface Props {}

// 通过key路径数组在menuItems树中查找匹配到的menuItem项
const getActiveMenuItem = (menuItems = [], keyPath = []) => {
  let activeMenuItem = null;
  let curKey = '';
  let _menuItems = menuItems;
  for(let i = keyPath.length; i >= 1; i--) {
    curKey = keyPath[i - 1];
    activeMenuItem = _menuItems.find(item => item.key === curKey);
    if (activeMenuItem?.children?.length) {
      _menuItems = activeMenuItem?.children;
    }
  }
  return activeMenuItem;
}

// 通过path关键词

const DashboardLayout = (props: PropsWithChildren<Props>) => {
  const {
    children,
  } = props;
  const params = useParams();
  const location = useLocation();
  console.log('hello', params, location)
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    {
      key: '1',
      icon: <SettingOutlined />,
      label: '设置',
      children: [
        {
          key: '1-1',
          icon: <MoreOutlined />,
          label: '后台用户',
          path: 'setting-manage-user',
        }
      ],
    },
    {
      key: '2',
      icon: <FileOutlined />,
      label: '页面',
      path: 'business-page',
    },
    {
      key: '3',
      icon: <RocketOutlined />,
      label: '产品',
      children: [
        {
          key: '3-1',
          icon: <MoreOutlined />,
          label: '类目',
          path: 'product-category',
        },
        {
          key: '3-2',
          icon: <MoreOutlined />,
          label: '产品目录',
          path: 'product-self',
        },
      ],
    },
    {
      key: '4',
      icon: <UserOutlined />,
      label: '经销商',
      path: 'dealer',
    },
    {
      key: '5',
      icon: <TeamOutlined />,
      label: '用户',
      path: 'user',
    },
  ];
  const onClick: MenuProps['onClick'] = event => {
    const activeMenuItem = getActiveMenuItem(menuItems, event.keyPath);
    navigate(`${activeMenuItem.path}`);
  };
  return (
    <Layout className="dashboard-layout">
      <Sider className="dashboard-sider" trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          onClick={onClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1-1']}
          defaultOpenKeys={['1', '3']}
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content className="site-layout-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;