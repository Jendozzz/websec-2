const PORT = process.env.PORT || 2000;
const XMLHttpRequest = require('xhr2');
const http = require('http');
const express = require('express');
const app = express();
const server = http.Server(app);
const path = require('path');
const bp = require('body-parser');
const HTMLParser = require('node-html-parser');
const fs = require('fs');

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
server.listen(PORT, function () {
    console.log('Server port 2000');
});

app.get('/rasp', (req, res) => {
    console.log(req.url);
    const url = "https://ssau.ru/rasp?groupId=531873998";

    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            console.log(request.responseText);
        }
    }
})
 