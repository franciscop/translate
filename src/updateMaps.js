const request = require('request'),
    fs = require('fs');

function updateMaps(engine) {
    let url, key;
    switch(engine) {
        case 'google':
            key = process.env.GOOGLE_APIKEY;
            url = 'https://translation.googleapis.com/language/translate/v2/languages';
            request.post(url, { form: {key, target: 'en'} }, (error, response) => {
                debugger
                if (error) return console.error('Failed API call.');
                let map = Object.assign({}, ...JSON.parse(response.body).data.languages.map(lang => { return { [lang.name.toLowerCase()]: lang.language } }));
                fs.writeFileSync('../data/google.js', `export default ${JSON.stringify(map, null, 2)}`);
            });
        break;
        case 'yandex':
            key = process.env.YANDEX_APIKEY;
            url = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
            request.post(url, { form: {key: key, ui: 'en'} }, (error, response) => {
                if (error) return console.error('Failed API call.');
                let map = Object.assign({}, ...Object.entries(JSON.parse(response.body).langs).map(([a, b]) => ({ [b.toLowerCase()]: a })));
                fs.writeFileSync('../data/yandex.js', `export default ${JSON.stringify(map, null, 2)}`);
            });
        break;
    }
}

updateMaps('google');
updateMaps('yandex');
