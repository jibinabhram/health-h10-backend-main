
const http = require('http');

const data = JSON.stringify({
    name: 'Test Drill 3',
    event_type: 'training',
    club_id: 'beecbc76-c71f-4311-a60b-eaee54303f8c'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/exercise-types',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${body}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
