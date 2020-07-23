function singleId(): string {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export default singleId;
