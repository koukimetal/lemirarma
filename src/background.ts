chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "lemirarma",
        "title": "Lemirarma",
        "contexts": ["selection"]
    });
});

export interface Result {
    url: string;
    rating: number;
    count: number;
    text: string;
}

const search = (query: string) => new Promise<Result[]>((resolve, reject) =>  {
    let requestUrl = 'https://www.google.com/search?ie=UTF-8&q=' + encodeURIComponent(query + ' indeed reviews');
    fetch(requestUrl)
    .then(response => {
        response.text().then(resbody => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(resbody, "text/html");
            console.log(doc);
            console.log(doc.querySelectorAll('.rc'));
            const results: Result[] = [];
            doc.querySelectorAll('.rc').forEach(elems => {
                try {
                    const anchor = elems.querySelector('.r a');
                    const link = anchor.getAttribute('href');
                    const text = anchor.textContent;
                    if (link.includes('indeed')) {
                        const rateText = elems.querySelector('.s .slp').textContent;
                        const ratingMatchText = rateText.match(/[0-9]\.[0-9]+/)[0];
                        const reviewRating = parseFloat(ratingMatchText);
                        const textWithoutRating = rateText.replace(ratingMatchText, '');
                        const reviewNum = parseInt(textWithoutRating.match(/[0-9]+/)[0]);
                        console.log(reviewRating, reviewNum);
                        results.push({
                            url: link, rating: reviewRating, count: reviewNum, text
                        })
                    }
                } catch (e) {
                    console.log(e);
                }
            })
            resolve(results);
        }).catch(reason => reject(reason));
    });
});

let posX = 0, posY = 0;

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lemirarma") {
        search(info.selectionText).then(results => {
            var msg = {type: 'doneSearch', x: posX, y: posY, results};
            console.log(msg);
            chrome.tabs.sendMessage(tab.id, msg);
        })
    }
});


chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'clickedPosition') {
        posX = msg.x;
        posY = msg.y;
    }
})

