function getStyle(ele: any, key: string) {
  if (typeof ele.currentStyle === 'undefined') {
    return ele.ownerDocument.defaultView.getComputedStyle(ele, null)[key];
  } else {
    return ele.currentStyle[key];
  }
}
export const videoAuto = () => {
  if (document.getElementsByTagName('video').length === 0) {
    setTimeout(() => {
      videoAuto();
    }, 5e2);
    return;
  }
  if (
    window.innerWidth / window.innerHeight >=
    parseFloat(getStyle(document.getElementsByTagName('video')[0], 'width')) /
    parseFloat(getStyle(document.getElementsByTagName('video')[0], 'height'))
  ) {
    document.getElementsByTagName('video')[0].style.width = '100%';
    document.getElementsByTagName('video')[0].style.height = 'auto';
    document.getElementsByTagName('video')[0].volume = 0.05;
  } else {
    document.getElementsByTagName('video')[0].style.width = 'auto';
    document.getElementsByTagName('video')[0].style.height = '100%';
    document.getElementsByTagName('video')[0].volume = 0.05;
  }
};
