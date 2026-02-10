import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const res: any = await prisma.$queryRaw`
      SELECT
          conname AS constraint_name,
          contype AS constraint_type
      FROM
          pg_constraint
      WHERE
          conname LIKE '%activity_metrics%';
    `;
        console.log('Constraints:', JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
