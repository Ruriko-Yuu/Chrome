(function (open, send) {
  (window as any).timing = new Map();
  var xhrOpenRequestUrl; // capture method and url
  var xhrSendResponseUrl; // capture request body
  (XMLHttpRequest as any).prototype.open = function (
    method: any,
    url: string | URL,
    ...args: any
  ) {
    xhrOpenRequestUrl = new URL(url, document.location.href).href;
    (window as any).timing[xhrOpenRequestUrl] = {
      begin: new Date().valueOf(),
      method: method,
    };
    open.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.send = function (data) {
    const xmlConsole = function () {
      if ((document.getElementById('xmlConsole') === null || document.getElementById('xmlConsole')?.className === 'off')) return
      if ((window as any).timing[this.responseURL] && this.readyState === 4) {
        xhrSendResponseUrl = this.responseURL;
        var duration =
          new Date().valueOf() -
          (window as any).timing[xhrSendResponseUrl].begin;
        const color =
          duration < 1e3 ? '#289847' : duration < 3e3 ? '#FBC017' : '#E74032';
        try {
          console.debug(
            `%c ${(window as any).timing[xhrSendResponseUrl].method
            }%c${xhrSendResponseUrl}%c ${duration}ms `,
            `color: #FFF;background-color: ${color};line-height: 22px;border: 1px solid ${color};border-radius: 4px 0 0 4px;display: inline-block;padding-right: 5px;width: 30px`,
            `color: ${color};line-height: 22px;border: 1px solid ${color};border-left: 0;border-right: 0;padding: 0 5px; `,
            `color: #fff;background-color: ${color};line-height: 22px;border: 1px solid ${color};border-radius: 0 4px 4px 0`,
            JSON.parse(this.response)
          );
        } catch (error) { }
        // console.log({
        //   timingVar:
        //     (window as any).timing[xhrSendResponseUrl].method +
        //     ':' +
        //     xhrSendResponseUrl,
        //   timingValue: duration,
        //   data: JSON.parse(data as string),
        // });
      }
    }
    this.addEventListener(
      'readystatechange',
      xmlConsole,
      false
    );
    send.apply(this, arguments as any);
  };
  console.debug('XMLHttpRequestTools init')
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
