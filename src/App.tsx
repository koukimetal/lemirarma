import * as React from 'react';

export const App: React.SFC<{}> = props => {
    const [url, setUrl] = React.useState('');
    const [resp, setResp] = React.useState('');

    const doSearch = () => {
        let requestUrl = 'https://www.google.com/search?ie=UTF-8&q=' + encodeURIComponent(url + ' indeed reviews');
        fetch(requestUrl)
        .then(response => {
            response.text().then(resbody => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(resbody, "text/html");
                console.log(doc);
                console.log(doc.querySelectorAll('.rc'));
                doc.querySelectorAll('.rc').forEach(elems => {
                    try {
                        const anchor = elems.querySelector('.r a');
                        const link = anchor.getAttribute('href');
                        if (link.includes('indeed')) {
                            const rateText = elems.querySelector('.s .slp').textContent;
                            const ratingMatchText = rateText.match(/[0-9]\.[0-9]+/)[0];
                            const reviewRating = parseFloat(ratingMatchText);
                            const textWithoutRating = rateText.replace(ratingMatchText, '');
                            const reviewNum = parseInt(textWithoutRating.match(/[0-9]+/)[0]);
                            console.log(reviewRating, reviewNum);
                            setResp(reviewRating + " " + reviewNum + "\n");
                        }
                    } catch (e) {
                        console.log(e);
                    }
                })
            })
        });
    }

    return (
        <div>
            <input onChange={(e) => setUrl(e.currentTarget.value)} value={url} />
            <button onClick={doSearch}>Search</button>
            <textarea value={resp} />
        </div>
    )
};
