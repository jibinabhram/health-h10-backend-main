import { PrismaClient } from '@prisma/client';

async function checkClub() {
    const prisma = new PrismaClient();
    try {
        const clubs = await prisma.club.findMany({ select: { club_id: true, club_name: true } });
        console.log('CLUBS_IN_DB:');
        clubs.forEach(c => console.log(`ID: ${c.club_id} | Name: ${c.club_name}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkClub();
