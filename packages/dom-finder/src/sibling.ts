export const findPreviousSibling = (el: Element) => {
  let newElement = null;

  if (el.previousElementSibling) {
    newElement = el.previousElementSibling;

    while (newElement.lastElementChild) {
      newElement = newElement.lastElementChild;
    }
  } else {
    newElement = el.parentNode;
  }

  return newElement;
};

export const findNextSibling = (el: Element) => {
  let newElement = null;

  if (el.firstElementChild) {
    newElement = el.firstElementChild;
  } else {
    let sibling = el;

    while (sibling) {
      if (sibling.nextElementSibling) {
        newElement = sibling.nextElementSibling;
        break;
      }

      sibling = sibling.parentNode as Element;
    }
  }

  return newElement;
};
