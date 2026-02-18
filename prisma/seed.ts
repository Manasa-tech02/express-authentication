import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma';

async function seed() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin1234';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (existingAdmin) {
        console.log('Admin user already exists!');
        return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    });

    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`ID: ${admin.id}`);
}

seed()
    .catch((error) => {
        console.error('Error seeding:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
