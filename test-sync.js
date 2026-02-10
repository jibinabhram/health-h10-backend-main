const axios = require('axios');

async function testSync() {
    const payload = {
        session_id: "2026-02-10-11-53-14",
        player_id: "5bea404f-6f0b-44a5-a3c2-7f6f777d850c",
        metrics: {
            device_id: "TEST-01",
            total_distance: 100,
            hsr_distance: 10,
            sprint_distance: 5,
            top_speed: 30,
            sprint_count: 2,
            recorded_at: Date.now()
        }
    };

    try {
        const res = await axios.post('http://localhost:3000/activity-metrics/sync', payload);
        console.log('✅ Success:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.log('❌ Failed:', err.response ? err.response.data : err.message);
    }
}

testSync();
