export const trunc = (srcString: String | undefined, maxN: number): String => {
  if (typeof srcString === 'undefined') {
    return '';
  }
  
  if (srcString.length <= maxN) {
    return srcString;
  }

  return srcString.substring(0, maxN) + '..';
};