import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const playersCount = await prisma.player.count();
        const eventsCount = await prisma.event.count();
        const metricsCount = await prisma.activityMetric.count();

        console.log('Players count:', playersCount);
        console.log('Events count:', eventsCount);
        console.log('Metrics count:', metricsCount);

        if (playersCount > 0) {
            const somePlayers = await prisma.player.findMany({ take: 5 });
            console.log('Sample Players:', JSON.stringify(somePlayers, null, 2));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
