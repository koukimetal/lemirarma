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
                    const anchor = elems.querySelector('.r a');
                    if (anchor) {
                        const link = anchor.getAttribute('href');
                        if (link) {
                            if (link.includes('indeed')) {
                                const rate = elems.querySelector('.s .slp').textContent;
                                setResp(link + '\n' + rate);
                            }
                        }
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
