import app from "./app";
import config from "./app/config";
import prisma from "./app/config/prisma";
import "dotenv/config";

const PORT = config.port;

async function main() {
  try {
    if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
  } catch (error) {
    console.error("error starting the server", error);
    process.exit(1);
  }
}

main();
