import { PrismaClient } from '@prisma/client';
import { createSeedSnapshot } from '../src/data/seed-data.js';

const prisma = new PrismaClient();

async function main() {
  const snapshot = createSeedSnapshot();

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: snapshot.users.map((user) => ({
      id: user.id,
      username: user.username,
      passwordHash: user.passwordHash,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    })),
  });

  await prisma.product.createMany({
    data: snapshot.products,
  });

  await prisma.campaign.createMany({
    data: snapshot.campaigns,
  });

  for (const order of snapshot.orders) {
    await prisma.order.create({
      data: {
        id: order.id,
        orderNo: order.orderNo,
        customerName: order.customerName,
        amount: order.amount,
        status: order.status,
        channel: order.channel,
        address: order.address,
        createdAt: order.createdAt,
        items: {
          create: order.items.map((item, index) => ({
            id: `${order.id}-item-${index + 1}`,
            productName: item.name,
            quantity: item.quantity,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });