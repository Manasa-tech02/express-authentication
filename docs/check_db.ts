
import prisma from './src/lib/prisma';

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Successfully connected to the database.`);
        console.log(`Found ${userCount} users in the 'User' table.`);

        const users = await prisma.user.findMany();
        console.log('Users:', users);
    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
