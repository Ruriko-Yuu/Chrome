(function () {
  console.log = () => {};
  (window as any).echo = console.debug;
})();
