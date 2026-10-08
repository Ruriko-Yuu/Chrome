const myBtn = () => {
    const container = document.getElementsByClassName('feed-roll-btn')
    console.log('container', container);
    if (container.length > 0) {
        // container[0].innerHTML = ''
        var e = document.createElement("button");
        e.innerHTML = '换一换';
        e.onclick = () => {
            console.log('mybtn clicked')
            fetch('https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd', {}).then((res) => {
                console.log(res.json().then(data => console.log(data.data.item)))
            }).catch(err => console.log(err))
        }
        container[0].appendChild(e)
    } else {
        setTimeout(() => {
            myBtn()
        }, 1e3);
    }
}

export const bili = () => {
    if (
        'https://www.bilibili.com/'.indexOf(window.location.href.split('?')[0]) !==
        -1
    ) {
        console.log(
            `%c换一换回退模块加载`,
            'color:white;background: #4386FE;padding: 3px 10px;border-radius: 3px'
        );
        myBtn()
    }
}