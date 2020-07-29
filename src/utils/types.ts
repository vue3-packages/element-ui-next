export function isString(obj): boolean {
  return Object.prototype.toString.call(obj) === "[object String]";
}

export function isObject(obj): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function isHtmlElement(node): boolean {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

export const isFunction = (functionToCheck) => {
  const getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === "[object Function]";
};

export const isUndefined = (val) => {
  return val === void 0;
};

export const isDefined = (val) => {
  return val !== undefined && val !== null;
};
