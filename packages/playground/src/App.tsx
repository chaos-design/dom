import {
  EyeInvisibleOutlined,
  EyeOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useInspector } from '@chaos-design/inspector';
import { Alert, Button, Layout, Space, Tag, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';

import ApiLab from './components/ApiLab';
import Fixture from './components/Fixture';

import './index.css';

const REPO_URL = 'https://github.com/chaos-design/dom';
const AUTHOR_URL = 'https://github.com/rain120';

const App = observer(() => {
  const root = useMemo(
    () => document.getElementById('root') ?? document.body,
    [],
  );
  const app = useInspector(root);
  const hidden = app.config.hide;

  return (
    <Layout className="pg-root">
      <Layout.Header className="pg-header">
        <div className="pg-header-inner">
          <div className="pg-header-left">
            <a
              className="pg-brand"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <GithubOutlined className="pg-brand-icon" />
              <span className="pg-brand-text">Chaos DOM</span>
              <Tag className="pg-brand-tag">Playground</Tag>
            </a>

            {/* Inspector 的浮动面板会盖住页面右侧，
                关闭开关放在左侧才保证始终点得到 */}
            <Button
              className="pg-inspector-toggle"
              type={hidden ? 'default' : 'primary'}
              size="small"
              icon={hidden ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => (hidden ? app.enable() : app.disable())}
            >
              {hidden ? '开启 Inspector' : '关闭 Inspector'}
            </Button>
          </div>

          <nav className="pg-nav" aria-label="主导航">
            <a
              className="pg-nav-link"
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              仓库
            </a>
            <a
              className="pg-nav-link"
              href={`${REPO_URL}/tree/main/packages`}
              target="_blank"
              rel="noreferrer"
            >
              包
            </a>
            <a
              className="pg-nav-link"
              href={AUTHOR_URL}
              target="_blank"
              rel="noreferrer"
            >
              作者
            </a>
          </nav>
        </div>
      </Layout.Header>

      <Layout.Content className="pg-content">
        <Alert
          type="info"
          showIcon
          title="这是一个测试台，不是展示页"
          description={
            <span>
              页面本身是 <code>@chaos-design</code> 各包的测试数据。
              {hidden
                ? ' 点左上角「开启 Inspector」启用拾取。'
                : ' Inspector 已启用，直接点选页面元素即可。'}
              拾取结果会实时显示在下方。
            </span>
          }
          className="pg-intro"
        />

        <ApiLab app={app} />

        <div className="pg-divider" />

        <Typography.Title level={4} style={{ marginTop: 0 }}>
          测试数据
        </Typography.Title>
        <Fixture />

        <div style={{ height: 64 }} />
      </Layout.Content>

      <Layout.Footer className="pg-footer">
        <Typography.Text type="secondary">
          chaos-design/dom · MIT
        </Typography.Text>
      </Layout.Footer>
    </Layout>
  );
});

export default App;
