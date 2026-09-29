import getCssSelector from '@chaos-design/css-selector';
import { findNextSibling, findPreviousSibling } from '@chaos-design/dom-finder';
import type { useInspector } from '@chaos-design/inspector';
import { getParagraph, getSentence, getText } from '@chaos-design/selection';
import { Button, Flex, Space, Tag, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';

type InspectorApp = ReturnType<typeof useInspector>;

interface ProbeResult {
  label: string;
  selector: string;
  previous: string;
  next: string;
}

interface SelectionState {
  text: string;
  paragraph: string;
  sentence: string;
}

const EMPTY_SELECTION: SelectionState = {
  text: '',
  paragraph: '',
  sentence: '',
};

function describe(node: Node | null): string {
  if (!node || node.nodeType !== Node.ELEMENT_NODE) {
    return '—';
  }
  const el = node as Element;
  return el.tagName.toLowerCase();
}

function probe(el: Element, label: string): ProbeResult {
  // 单元素入参返回 string，多元素入参返回 string[]，这里统一成可展示的文本
  const raw = getCssSelector(el);
  const selector = Array.isArray(raw) ? raw.join(' | ') : raw;

  return {
    label,
    selector: selector || '—',
    previous: describe(findPreviousSibling(el)),
    next: describe(findNextSibling(el)),
  };
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(done, done);
    } else {
      done();
    }
  }, [value]);

  return (
    <Button size="small" onClick={onCopy} disabled={!value || value === '—'}>
      {copied ? '已复制' : '复制'}
    </Button>
  );
}

/** 展示 Inspector 内部当前选中的元素，验证 store 打通 */
const InspectorWatch = observer(({ app }: { app: InspectorApp }) => {
  const selector = app.selected?.selector || '';
  const tag = describe(app.selected?.selectedElement ?? null);

  return (
    <Flex vertical gap={4}>
      <Typography.Text type="secondary">Inspector 实时选中</Typography.Text>
      {selector ? (
        <Flex align="center" gap={8}>
          <Tag color="purple">{tag}</Tag>
          <Typography.Text code copyable={{ text: selector }}>
            {selector}
          </Typography.Text>
        </Flex>
      ) : (
        <Typography.Text type="secondary">
          尚未选中 —— 点击上方「Inspector 拾取」按钮，再点选页面元素
        </Typography.Text>
      )}
    </Flex>
  );
});

export default function ApiLab({ app }: { app: InspectorApp }) {
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [selection, setSelection] = useState<SelectionState>(EMPTY_SELECTION);

  useEffect(() => {
    const onSelectionChange = () => {
      const { sentence } = getSentence();
      setSelection({
        text: getText(),
        paragraph: getParagraph(),
        sentence,
      });
    };

    document.addEventListener('selectionchange', onSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange);
    };
  }, []);

  const bindProbe = (label: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      setResult(probe(e.currentTarget, label));
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      setResult(probe(e.currentTarget, label));
    },
  });

  return (
    <Flex vertical gap={16}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        API 实时演示
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
        悬停或聚焦下面的元素，实时查看 <code>@chaos-design</code> 各包的输出。
      </Typography.Paragraph>

      <Flex gap={12} wrap>
        <Button type="primary" {...bindProbe('主按钮')}>
          悬停我
        </Button>
        <Button {...bindProbe('次按钮')}>悬停我</Button>
        <Button type="dashed" {...bindProbe('虚线按钮')}>
          悬停我
        </Button>
      </Flex>

      {result ? (
        <Space orientation="vertical" size={4} style={{ width: '100%' }}>
          <Typography.Text type="secondary">
            {result.label} · css-selector
          </Typography.Text>
          <Space>
            <Typography.Text code style={{ wordBreak: 'break-all' }}>
              {result.selector}
            </Typography.Text>
            <CopyButton value={result.selector} />
          </Space>
          <Typography.Text type="secondary">
            {result.label} · dom-finder
          </Typography.Text>
          <Space size={8}>
            <Tag>prev: {result.previous}</Tag>
            <Tag>next: {result.next}</Tag>
          </Space>
        </Space>
      ) : (
        <Typography.Text type="secondary">
          悬停上方任意元素查看结果
        </Typography.Text>
      )}

      <Typography.Paragraph style={{ margin: 0, lineHeight: 1.9 }}>
        请在下面这段文字中拖动鼠标选中内容，
        <Typography.Text strong>@chaos-design/selection</Typography.Text>{' '}
        会实时给出选区文本、所在段落与所在句子。三者的区别在于
        选区之外的上下文范围，这正是手写 selection API 最容易出错的地方。
      </Typography.Paragraph>

      <Space orientation="vertical" size={4} style={{ width: '100%' }}>
        <Typography.Text type="secondary">选区文本</Typography.Text>
        <Typography.Text code style={{ wordBreak: 'break-all' }}>
          {selection.text || '—'}
        </Typography.Text>
        <Typography.Text type="secondary">所在段落</Typography.Text>
        <Typography.Text style={{ wordBreak: 'break-all' }}>
          {selection.paragraph || '—'}
        </Typography.Text>
        <Typography.Text type="secondary">所在句子</Typography.Text>
        <Typography.Text style={{ wordBreak: 'break-all' }}>
          {selection.sentence || '—'}
        </Typography.Text>
      </Space>

      <InspectorWatch app={app} />
    </Flex>
  );
}
