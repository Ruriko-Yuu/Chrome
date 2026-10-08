export const titleChange = () => {
  let doc: any = document;
  let hidden = '';
  let visibilityChange = '';
  let titleSave = doc.title
  if (typeof doc.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof doc.mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
  } else if (typeof doc.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof doc.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }


  document.addEventListener(
    visibilityChange,
    () => {
      if (doc[hidden]) {
        document.title = `(╯‵□′)╯︵┻━┻ ${titleSave}`;
      } else {
        document.title = '欢迎回来';
        setTimeout(() => {
          if (!doc[hidden]) {
            document.title = titleSave;
          }
        }, 3e3)
      }
    },
    false
  );
}