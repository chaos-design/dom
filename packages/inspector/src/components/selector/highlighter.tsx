import { ElementRect } from '../../utils/dom/selector';

export interface HighlighterProps {
  elements?: ElementRect[];
  stroke?: string;
  activeStroke?: string;
  fill?: string;
  activeFill?: string;
}

export default function Highlighter(props: HighlighterProps) {
  const getNumber = (num: number) => {
    if (Number.isNaN(num) || !num) {
      return 0;
    }

    return num;
  };

  const getFillColor = (item: ElementRect) => {
    if (!item) {
      return undefined;
    }

    if (item.outline) {
      return undefined;
    }

    return item.highlight ? props.fill : props.activeFill || props.fill;
  };

  const getStrokeColor = (item: ElementRect) => {
    if (!item) {
      return undefined;
    }

    return item.highlight ? props.stroke : props.activeStroke || props.stroke;
  };

  if (!props.elements?.length) {
    return null;
  }

  return (
    <>
      {props.elements.map((el, index) => (
        <rect
          x={getNumber(el?.x)}
          y={getNumber(el?.y)}
          fill={getFillColor(el)}
          stroke={getStrokeColor(el)}
          strokeDasharray={el?.outline ? '5,5' : undefined}
          width={getNumber(el?.width)}
          height={getNumber(el?.height)}
          strokeWidth="2"
          key={index}
        />
      ))}
    </>
  );
}
