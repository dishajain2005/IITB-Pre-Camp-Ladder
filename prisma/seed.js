import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.player.createMany({
    data: [
      //Badminton Players
      { name: "Sai Charan", sport: "Badminton", points:1},
      { name: "Arya", sport: "Badminton", points: 2 },
      //Lawn Tennis Players
      { name: "Aryan Chaurasia", sport: "Lawn Tennis", points:3 },
      { name: "Ashank Deo", sport: "Lawn Tennis", points: 2 },
      { name: "Atharv Naik", sport: "Lawn Tennis", points: 3 },
      { name: "Yashwanth", sport: "Lawn Tennis", points: 4 },
      { name: "Bhavya Upadhyay", sport: "Lawn Tennis", points: 5 },
      { name: "Samarpit Bhatia", sport: "Lawn Tennis", points: 6 },
      //Table Tennis Players
      { name: "Sameer", sport: "Table Tennis", points: 1 },
      { name: "Aryansh", sport: "Table Tennis", points: 2 },
      { name: "Sanat", sport: "Table Tennis", points: 3 },
      { name: "Dinesh", sport: "Table Tennis", points: 4 },
      { name: "Arya", sport: "Table Tennis", points: 5 },
      { name: "Aaron", sport: "Table Tennis", points: 6 },
      //Squash Players
      { name: "Twara", sport: "Squash", points: 1 },
      { name: "Aditi", sport: "Squash", points: 2 },
      { name: "Anvi", sport: "Squash", points: 3 },
      { name: "Ganga", sport: "Squash", points: 4 },
      { name: "Jasmine", sport: "Squash", points: 5 },
      { name: "Maanya", sport: "Squash", points: 6 },
    ],
  });
  console.log(" Players seeded!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
