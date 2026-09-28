import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  // Main admin — the President is the only account that can manage users.
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { role: "President" },
    create: {
      username: "admin",
      email: "president@uu.edu.bd",
      name: "Club President",
      role: "President",
      password: adminPassword,
    },
  });

  console.log("Database seeded successfully!");
  console.log("Default admin credentials: admin / admin123 (role: President)");
  console.log("CHANGE THE PASSWORD IN PRODUCTION!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
