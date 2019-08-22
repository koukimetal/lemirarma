import * as m from 'mithril';
import {Result} from 'background';

const ResultLine: m.Component<{result: Result}> = {
    view ({attrs: {result}}) {
      return m('a', {href: result.url, style: 'display:block;', title: result.text, target: '_blank' }, `${result.rating} (${result.count})`);
    }
};

const SearchResult = (results: Result[], x: number, y: number): m.Children => {
    return m('div', {
        style: `left: ${x}px; top: ${y}px; position: absolute; width: 200px; height: 200px; background-color: red;`
    }, results.map(result => m(ResultLine, {result})));
}

document.addEventListener('click', function (e) {
    var msg = {type: 'clickedPosition', x: e.clientX + window.scrollX, y: e.clientY + window.scrollY};
    console.log(msg);
    chrome.runtime.sendMessage(msg);
});
chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        console.log(msg);
        if (msg.type === 'doneSearch') {
            const elem = document.createElement('div');
            elem.id = 'popupforme';
            document.body.appendChild(elem);
            m.render(elem, SearchResult(msg.results, msg.x, msg.y));
            document.addEventListener('click', (event) => {
                if ((event.target as HTMLTextAreaElement).closest('#popupforme')) {
                    console.log('inside');
                } else {
                    document.getElementById('popupforme').remove();
                }
            });
        }
    }
);