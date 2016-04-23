const ratio = 68/105;

export function calculateSize (width, height) {

  if (width > height) {
    return {
      width: width,
      height: width / ratio
    };
  }

  return {
    width: height * ratio,
    height: height
  };

}