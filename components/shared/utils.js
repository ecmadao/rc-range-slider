const isArray = (array) => Object.prototype.toString.call(array) === '[object Array]';

const isEqual = (arrayA, arrayB) => {
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false;
    }
  }
  return true;
};

const mousePosition = (e) => {
  e = e || window.event;
  const xPos = e.pageX
    ? e.pageX
    : e.clientX + document.body.scrollLeft - document.body.clientLeft;
  const yPos = e.pageY
    ? e.pageY
    : e.clientY + document.body.scrollTop - document.body.clientTop;
  return {
    x: xPos,
    y: yPos
  };
};

const disableMouseDown = (e) => {
  const event = e || window.event;
  event.preventDefault();
  event.stopPropagation();
};

const getStandardAbsolutePosition = (position, minPosition, maxPosition) => {
  if (position < minPosition) {
    position = minPosition;
  }
  if (position > maxPosition) {
    position = maxPosition;
  }
  return position;
};

export default {
  isArray,
  isEqual,
  mousePosition,
  disableMouseDown,
  validatePosition: getStandardAbsolutePosition
};
