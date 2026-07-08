import app from "./app";
import config from "./app/config";
import prisma from "./app/config/prisma";
import "dotenv/config";

const PORT = config.port;

async function main() {
  try {
    // await prisma.$connect();
    // console.log("Connected to the database successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("error starting the server", error);
    // await prisma.$disconnect();
    process.exit(1);
  }
}

main();
