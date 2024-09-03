import React, { useEffect, useRef, useState } from 'react';

import getCssSelector from '@chaos-design/css-selector';
import { findPreviousSibling, findNextSibling } from '@chaos-design/dom-finder';

import './index.css';
import DomDemo from './dom';

function App() {
  const [count, setCount] = useState<number>(0);
  const demoRef = useRef<any>(null);
  const cardRef = useRef(null);

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
      const selector = getCssSelector([
        cardRef.current,
        demoRef.current.dom,
      ]);
      console.log('selector', selector);
    }
  }, []);

  return (
    <>
      <h1>Vite + React + ts</h1>
      <h3>create by chaos</h3>
      <div className="card" ref={cardRef}>
        <button onClick={() => setCount((count: number) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <DomDemo ref={demoRef} />
    </>
  );
}

export default App;
