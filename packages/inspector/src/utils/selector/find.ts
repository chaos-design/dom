export interface FindDataProps {
  selector: string;
  multiple?: boolean;
}

export default class FindElement {
  static cssSelector(props: FindDataProps, ctx: Document = document) {
    if (props.multiple) {
      return ctx.querySelectorAll(props.selector);
    }

    return ctx.querySelector(props.selector);
  }

  static xpath(props: FindDataProps, ctx: Document = document) {
    const resultType = props.multiple
      ? XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
      : XPathResult.FIRST_ORDERED_NODE_TYPE;

    let result = null;
    const elements = ctx.evaluate(props.selector, ctx, null, resultType, null);

    if (props.multiple) {
      result = [];

      let element = elements.iterateNext();

      while (element) {
        result.push(element);

        element = elements.iterateNext();
      }
    } else {
      result = elements.singleNodeValue;
    }

    return result;
  }

  // static attributes(element: Element) {
  //   const attributes: Readonly<Partial<Attr>> = {};

  //   Array.from(element).forEach((el) => {
  //     Array.from(el.attributes).forEach(({ name, value }) => {
  //       attributes[name] = value;
  //     });
  //   });
  //   return attributes;
  // }
}
