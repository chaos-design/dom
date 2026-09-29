import { Flex, Table } from 'antd';
import React, { useState } from 'react';

import DomDemo from '../dom';

/**
 * 选择器生成器的测试数据。
 *
 * 这里刻意保留了「结构相同 + 内容重复」的表格与大量 chaos-* 标记：
 * 当页面出现多个结构一致的节点时，生成器必须回退到 :nth-of-type
 * 才能唯一命中目标 —— 这是选择器算法最容易出错、也最需要被覆盖的分支。
 * 同理，内联 SVG 的命名空间与 antd 组件生成的大量 class 也是刻意保留的。
 */
const COLUMNS = Array.from({ length: 4 }, (_, group) => [
  {
    title: `第 ${group + 1} 组 · 姓名`,
    dataIndex: 'name',
    key: `name-${group}`,
    className: group % 2 === 0 ? 'chaos-th-class' : undefined,
  },
  {
    title: `第 ${group + 1} 组 · 方向`,
    dataIndex: 'interest',
    key: `interest-${group}`,
  },
  {
    title: `第 ${group + 1} 组 · 年龄`,
    dataIndex: 'age',
    key: `age-${group}`,
    className: group % 2 === 0 ? 'chaos-th-class' : undefined,
  },
]).flat();

const BASE = [
  { key: '1', name: 'Chris', interest: 'HTML 表格', age: 22 },
  { key: '2', name: 'Dennis', interest: 'Web 无障碍', age: 45 },
  { key: '3', name: 'Sarah', interest: 'JavaScript 框架', age: 29 },
  { key: '4', name: 'Karen', interest: 'Web 性能', age: 36 },
];

// 每行重复 3 次，制造「内容完全相同」的兄弟节点
const DATA = BASE.flatMap((row) =>
  Array.from({ length: 3 }, (_, i) => ({ ...row, key: `${row.key}-${i}` })),
);

function Section({
  title,
  extra,
  children,
}: {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 32 }}>
      <Flex
        align="baseline"
        justify="space-between"
        gap={12}
        style={{ marginBottom: 12, flexWrap: 'wrap' }}
      >
        <h2 style={{ fontSize: 16, margin: 0 }}>{title}</h2>
        {extra}
      </Flex>
      {children}
    </section>
  );
}

export default function Fixture() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Section
        title="有状态节点"
        extra={<span>验证事件绑定后选择器是否仍然稳定</span>}
      >
        <div
          className="card"
          id="chaos-card-id"
          style={{
            border: '2px solid #d9d9d9',
            borderRadius: 8,
            padding: 16,
          }}
        >
          <button
            type="button"
            className="chaos-button-class"
            id="chaos-button-id"
            aria-label="计数按钮"
            onClick={() => setCount((c) => c + 1)}
          >
            count is {count}
          </button>
          <p
            data-test="chaos"
            className="chaos-p-class"
            style={{ margin: '8px 0 0' }}
          >
            节点内容随交互变化，选择器不应因此改变。
          </p>
        </div>
      </Section>

      <Section
        title="重复结构表格"
        extra={<span>4 组一致的列 × 3 行重复内容</span>}
      >
        <Table
          size="small"
          bordered
          columns={COLUMNS}
          dataSource={DATA}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Section>

      <Section
        title="内联 SVG"
        extra={<span>命名空间节点，常被选择器生成器漏掉</span>}
      >
        <svg
          className="chaos-svg"
          width="160"
          height="60"
          viewBox="0 0 160 60"
          role="img"
          aria-label="示例图标"
        >
          <title>示例图标</title>
          <rect width="160" height="60" rx="8" fill="#f0f5ff" />
          <circle
            className="chaos-circle"
            cx="30"
            cy="30"
            r="14"
            fill="#1677ff"
          />
          <path d="M70 44 L88 16 L106 44 Z" fill="#52c41a" />
        </svg>
      </Section>

      <Section title="嵌套组件" extra={<span>forwardRef + ref 透传</span>}>
        <DomDemo />
      </Section>
    </>
  );
}
