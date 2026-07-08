import { Prisma } from "@prisma/client";

const handlePrismaError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  if (error.code === "P2002") {
    return {
      statusCode: 409,

      message: "Duplicate value",

      errorDetails: [
        {
          path: "",

          message: "Unique constraint failed",
        },
      ],
    };
  }

  return {
    statusCode: 500,

    message: "Database Error",

    errorDetails: [
      {
        path: "",

        message: error.message,
      },
    ],
  };
};

export default handlePrismaError;