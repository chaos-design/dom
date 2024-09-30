export const slogan = 'dom-inspector';

export const styles = `
.${slogan} {
position: fixed;
pointer-events: none;
}
.${slogan}>div {
  position: absolute;
}
.${slogan} .tips {
  background-color: #333740;
  font-size: 0;
  line-height: 18px;
  padding: 3px 10px;
  position: fixed;
  border-radius: 4px;
  display: none;
}

.${slogan} .tips.reverse{

}

.${slogan} .tips .triangle {
  width: 0;
  height: 0;
  position: absolute;
  border-top: 8px solid #333740;
  border-right: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  left: 10px;
  top: 24px;
}

.${slogan} .tips.reverse .triangle {
  border-top: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #333740;
  border-left: 8px solid transparent;
  left: 10px;
  top: -16px;
}

.${slogan} .tips>div {
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  font-family: Consolas, Menlo, Monaco, Courier, monospace;
  overflow: auto;
}

.${slogan} .tips .tag {
  color: #e776e0;
}

.${slogan} .tips .id {
  color: #eba062;
}

.${slogan} .tips .class {
  color: #8dd2fb;
}

.${slogan} .tips .line {
  color: #fff;
}

.${slogan} .tips .size {
  color: #fff;
}

.${slogan}-theme-default {

}

.${slogan}-theme-default .margin {
  background-color: rgba(255, 111, 1, 0.6);
}

.${slogan}-theme-default .border {
  background-color: rgb(252, 248, 1);
}

.${slogan}-theme-default .padding {
  background-color: rgba(92, 253, 135, 0.7);
}

.${slogan}-theme-default .content {
  background-color: rgba(194, 245, 196, 0.3);
}
`;

const styleSheetID = 'ZC_DOM_INSPECTOR_DYNAMIC_STYLESHEET';

export const addDynamicStyles = (): void => {
  let styleElement = document.getElementById(styleSheetID);

  if (!styleElement) {
    styleElement = document.createElement('style');

    styleElement.id = styleSheetID;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    styleElement.type = 'text/css';
    styleElement.innerText = styles;
    document.head.appendChild(styleElement);
  }
};

export const removeDynamicStyles = (): void => {
  const styleElement = document.getElementById(styleSheetID);

  if (styleElement) {
    document.head.removeChild(styleElement);
  }
};
