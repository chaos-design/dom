import React, { useEffect, useRef, useState } from 'react';

import { Flex, Splitter, Typography } from 'antd';

import getCssSelector from '@chaos-design/css-selector';
import Inspector from '@chaos-design/inspector';
import { findPreviousSibling, findNextSibling } from '@chaos-design/dom-finder';

import DomDemo from './dom';

import './index.css';

const Content: React.FC<any> = ({ title, text }) => (
  <Flex style={{ height: '100%', width: '100%' }} vertical>
    <Flex justify="center">
      <Typography.Title
        level={5}
        style={{
          marginTop: 8,
        }}
      >
        {title}
      </Typography.Title>
    </Flex>
    <Flex>
      <div
        style={{
          padding: 20,
          width: '100%',
        }}
      >
        <code>{text}</code>
      </div>
    </Flex>
  </Flex>
);

function App() {
  const [count, setCount] = useState<number>(0);
  const demoRef = useRef<any>(null);
  const cardRef = useRef(null);

  // useEffect(() => {
  //   const domInspector = new DOMInspector({
  //     dom: document.querySelector('body') as HTMLElement,
  //     // dom: document.getElementById('iframe')?.contentWindow?.document as HTMLElement,
  //     onSelect: (dom: HTMLElement) => {
  //       console.log('onSelect', dom);
  //     },
  //     onDeselect: (dom: HTMLElement) => {
  //       console.log('onDeselect', dom);
  //     },
  //   });

  //   // domInspector.enable();

  //   return () => {};
  // }, []);

  useEffect(() => {
    if (demoRef.current?.dom) {
      const d = demoRef.current?.dom;
      const { previousSibling, nextSibling } = d;
      console.log('demoRef.current dom', d);
      d.style.border = '1px solid red';

      console.log(
        'previousSibling',
        previousSibling,
        findPreviousSibling(d),
        previousSibling.isEqualNode(findPreviousSibling(d)),
      );
      console.log(
        'nextSibling',
        nextSibling,
        findNextSibling(d),
        nextSibling.isEqualNode(findNextSibling(d)),
      );
    }
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      const selector = getCssSelector([cardRef.current, demoRef.current.dom]);
      console.log('selector', selector);
    }
  }, []);

  return (
    <div
      style={{
        paddingBottom: 200,
      }}
    >
      <Inspector />
      <h1 data-test="chaos" aria-label="vite-div" className="chaos">
        Vite + React + TS + Inspector
      </h1>
      <h3 className="chaos-h3-class" id="chaos-h3-id">
        create by chaos
      </h3>
      <div
        className="card"
        aria-label="card"
        ref={cardRef}
        style={{ border: '10px solid red' }}
      >
        <button
          className="chaos-button-class"
          id="chaos-button-id"
          aria-label="button"
          onClick={() => setCount((count: number) => count + 1)}
        >
          count is {count}
        </button>
        <p data-test="chaos" className="chaos-p-class">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <table className="chaos-table-class">
        <caption>Front-end web developer course 2021</caption>
        <thead>
          <tr className="chaos-tr-class" id="chaos-tr-id">
            <th scope="col">Person</th>
            <th scope="col">Most interest in</th>
            <th scope="col" className="chaos-th-class">
              Age
            </th>
            <th scope="col">Person</th>
            <th scope="col">Most interest in</th>
            <th scope="col" className="chaos-th-class">
              Age
            </th>
            <th scope="col">Person</th>
            <th scope="col">Most interest in</th>
            <th scope="col">Age</th>
            <th scope="col">Person</th>
            <th scope="col">Most interest in</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Chris</th>
            <td>HTML tables</td>
            <td className="chaos-th-class">22</td>
            <th scope="row">Chris</th>
            <td>HTML tables</td>
            <td>22</td>
            <th className="chaos-th-class" scope="row">
              Chris
            </th>
            <td>HTML tables</td>
            <td>22</td>
            <th scope="row">Chris</th>
            <td>HTML tables</td>
            <td>22</td>
          </tr>
          <tr>
            <th scope="row">Dennis</th>
            <td>Web accessibility</td>
            <td>45</td>
            <th scope="row">Dennis</th>
            <td>Web accessibility</td>
            <td className="chaos-th-class">45</td>
            <th scope="row">Dennis</th>
            <td>Web accessibility</td>
            <td>45</td>
          </tr>
          <tr>
            <th scope="row">Sarah</th>
            <td>JavaScript frameworks</td>
            <td>29</td>
          </tr>
          <tr>
            <th scope="row">Karen</th>
            <td>Web performance</td>
            <td>36</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={2}>
              Average age
            </th>
            <td>33</td>
          </tr>
        </tfoot>
      </table>
      {/* <iframe
        id="iframe"
        src="https://rain120.github.io/study-notes/"
        width="100%"
        height="400px"
      ></iframe> */}
      <DomDemo ref={demoRef} />
      <div
        style={{
          width: '100%',
          height: '200px',
          position: 'fixed',
          left: 0,
          bottom: 0,
          background: '#fff',
        }}
      >
        <Splitter
          style={{ height: 200, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        >
          <Splitter.Panel defaultSize="40%" min="20%" max="70%">
            <Content title="@chaos-design/css-selector" text="First" />
          </Splitter.Panel>
          <Splitter.Panel>
            <Content title="@chaos-design/dom-finder" text="Second" />
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
}

export default App;
