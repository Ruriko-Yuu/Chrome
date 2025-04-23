import Sortable from 'sortablejs';

function analyseBookMark(
  data: { [key: string]: any },
  bookmarkArray: any[],
  path: string
) {
  for (var children in data) {
    if (data[children].length > 0 && typeof data[children] == 'object') {
      if (data && data.title && data.title !== '') {
        path = path + data.title + '/';
      }
      analyseBookMark(data[children], bookmarkArray, path);
    } else {
      if (typeof data[children] == 'object') {
        for (var childKey in data[children]) {
          if (typeof data[children][childKey] == 'object') {
            if (data && data[children].title && data[children].title !== '') {
              path = path + data[children].title + '/';
            }
            analyseBookMark(data[children][childKey], bookmarkArray, path);
          } else {
            if (childKey === 'url') {
              var url = data[children][childKey];
              var title = data[children].title;
              var path = path;
              var jsonData = {
                title: title,
                url: url,
                path: path,
              };
              bookmarkArray.push(jsonData);
            }
          }
        }
      } else {
        if (children === 'url') {
          var url = data[children];
          var title = data.title;
          var path = path;
          var jsonData = {
            title: title,
            url: url,
            path: path,
          };
          bookmarkArray.push(jsonData);
        }
      }
    }
  }
}

const bookmarkList = () => {
  chrome.bookmarks.getTree(function (bookmarkArray) {
    console.log(bookmarkArray);
    let a: any[] = [];
    analyseBookMark(bookmarkArray, a, '');
    let innerHTML = '';
    a.forEach((ele) => {
      async function getFavicon(url: any) {
        try {
          const response = await fetch(url);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // 查找所有可能的 favicon 链接
          const favicon: any =
            doc.querySelector('link[rel="icon"]') ||
            doc.querySelector('link[rel="shortcut icon"]') ||
            doc.querySelector('link[rel="apple-touch-icon"]');

          if (favicon) {
            if (favicon.href.indexOf('http') === 0 || favicon.href.indexOf('data:image') === 0) {
              const faviconUrl = new URL(favicon.href, url).href;
              return faviconUrl;
            } else {
              const urlObj = new URL(ele.url);
              const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`; // 提取协议 + 域名
              if (favicon.href.split('/').length > 4) {
                return 'https://' + favicon.href.split('//')[favicon.href.split('//').length - 1]
              }
              return baseUrl + '/' + favicon.href.split('/')[favicon.href.split('/').length - 1]
            }
          } else {
            return `${new URL(url).origin}/favicon.ico`;
          }
        } catch (error) {
          return null;
        }
      }
      let imageUrl = ''
      // 使用示例
      getFavicon(ele.url).then(faviconUrl => {
        if (faviconUrl) {
          // 显示图标（例如设置到 <img> 标签）
          imageUrl = faviconUrl;
          innerHTML += `
            <li>
              <a href="${ele.url}" target="_blank">
                <img style="display: block;width: 30px;height: 30px;margin: 0 auto" src="${imageUrl}" />
                <p style="text-align: center;">${ele.title.slice(0, 4)}</p>
              </a>
            </li>
          `;
          document.getElementsByClassName('collection-space')[1].innerHTML = innerHTML;
        }
      });
    });
  });
  // //
  var el = document.getElementById('sort');
  //设置配置
  var ops = {
    animation: 300,
    //拖动结束
    onEnd: function (evt: any) {
      // console.log(evt);
      //获取拖动后的排序
      // const arr = sortable.toArray();
      // alert(JSON.stringify(arr));
    },
  };
  //初始化
  if (el !== null) {
    const sortable = Sortable.create(el, ops);
  }
};

export default bookmarkList;
