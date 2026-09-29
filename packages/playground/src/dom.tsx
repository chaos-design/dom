import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export interface DomDemoHandle {
  dom: HTMLTableCellElement | null;
}

const DomDemo = forwardRef<DomDemoHandle>(function DomDemo(_props, ref) {
  const [count, setCount] = useState(0);
  const cellRef = useRef<HTMLTableCellElement>(null);

  // 通过 imperative handle 把内部节点暴露给父级，验证 ref 透传链路
  useImperativeHandle(ref, () => ({ dom: cellRef.current }), []);

  return (
    <div>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="chaos-demo-button"
      >
        count is {count}
      </button>
      <table>
        <caption>嵌套组件内的表格</caption>
        <thead>
          <tr>
            <th scope="col">列标题1</th>
            <th scope="col" ref={cellRef}>
              列标题2
            </th>
            <th scope="col">列标题3</th>
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
    </div>
  );
});

export default DomDemo;
