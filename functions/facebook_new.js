const { facebook_token, facebook_secret } = require('../config.json');
const crypto = require('crypto');
const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, form) {
    const imgUrl = new URL(url);

    if (path.extname(imgUrl.pathname) == '.webp') {
        const fileName = path.basename(imgUrl.pathname, path.extname(imgUrl.pathname));
        const fullName = path.basename(imgUrl.pathname);
        const downloadPath = './img/temp';
        const finalPath = path.join(downloadPath, fullName);

        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath);
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const buffer = await response.buffer();  // Use response.buffer() para obter diretamente o buffer

            fs.writeFileSync(finalPath, buffer);

            await convertImg(finalPath);

            form.append('picture', buffer, { filename: 'picture.jpg' });
            form.append('thumbnail', buffer, { filename: 'thumbnail.jpg' });

            return form;
        } catch (error) {
            console.error('Erro ao baixar a imagem:', error.message);
        }
    } else {
        form.append('picture', url);
        form.append('thumbnail', url);

        return form;
    }
}

async function convertImg(img) {
    const webp = require('webp-converter');
    const result = webp.dwebp(img, './img/temp/picture.jpg', "-o", logging = "-v");
    result.then((response) => {
        console.log(response);
    })
}

module.exports = async (message, image) => {
    const form = new FormData();
    const appsecret_proof = crypto.createHmac('sha256', facebook_secret).update(facebook_token).digest('hex');
    const baseUrl = "https://graph.facebook.com/v18.0/228412443934071/feed"

    form.append('access_token', facebook_token);
    form.append('appsecret_prof', appsecret_proof);
    form.append('message', message);
    form.append('link', 'https://hdlvl.dev/s/discord');
    form.append('description', 'Entre em nosso discord e participe de todas partidas!');
    form.append('call_to_action', JSON.stringify({
        type: "OPEN_LINK",
        value: {
            link: 'https://hdlvl.dev/s/discord'
        }
    }));

    //const picture = await downloadImage(image, form);
    //console.log(form);

    const results = [];

    const fetchData = async () => {
        try {
            const response = await fetch(baseUrl, {
                method: 'post',
                body: form,
                headers: { "Content-Type": "multipart/form-data" }
            });
            const data = await response.json();
            console.log(data);
            results.push(data);
        } catch (error) {
            console.log(error);
            return error.message
        }
    }

    return fetchData().then(results => console.log(results)).catch(error => console.error(error));
}