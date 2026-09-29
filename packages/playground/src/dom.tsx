import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import './index.css';

function DomDemo(props: any, _r: any) {
  const [count, setCount] = useState<number>(0);
  const ref = useRef(null);

  useImperativeHandle(
    _r,
    () => ({
      dom: ref.current,
    }),
    [],
  );

  return (
    <>
      <h1>Vite + React + ts</h1>
      <h3>create by chaos</h3>
      <div className="card">
        <button onClick={() => setCount((count: number) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th>列标题1</th>
            <th ref={ref}>列标题2</th>
            <th>列标题3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>行1，列1</td>
            <td>行1，列2</td>
            <td>行1，列3</td>
          </tr>
          <tr>
            <td>行2，列1</td>
            <td>行2，列2</td>
            <td>行2，列3</td>
          </tr>
        </tbody>
      </table>
      <ul>
        <li>Coffee</li>
        <li>Milk</li>
      </ul>
    </>
  );
}

export default forwardRef(DomDemo);
