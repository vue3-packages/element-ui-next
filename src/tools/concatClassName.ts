const concatClassName = (baseClass: any[], attrClass: string[]): string[] => {
  let classList = baseClass;
  if (attrClass?.length > 0) {
    classList = classList.concat(attrClass);
  }
  return classList;
};

export default concatClassName;
