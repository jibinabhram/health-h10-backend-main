const http = require('http');

const payload = JSON.stringify({
    session_id: "2026-02-10-11-53-14",
    player_id: "5bea404f-6f0b-44a5-a3c2-7f6f777d850c",
    metrics: {
        device_id: "TEST-01",
        total_distance: 100,
        recorded_at: Date.now()
    }
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/activity-metrics/sync',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${data}`);
    });
});

req.on('error', (error) => {
    console.error(`Error: ${error.message}`);
});

req.write(payload);
req.end();
