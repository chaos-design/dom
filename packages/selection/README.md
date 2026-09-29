# @chaos-design/selection

Get selection text from mousemove drag selection.

## 使用

```tsx
import { getParagraph, getSentence, getText } from '@chaos-design/selection';

// https://developer.mozilla.org/en-US/docs/Web/API/Document/selectionchange_event
document.addEventListener('selectionchange', () => {
  console.log(getText(), getParagraph(), getSentence());
});
```
