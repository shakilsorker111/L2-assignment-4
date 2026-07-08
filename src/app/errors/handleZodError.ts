import { ZodError } from "zod";

const handleZodError = (error: ZodError) => {
  return {
    statusCode: 400,

    message: "Validation Error",

    errorDetails: error.issues.map(issue => ({
      path: issue.path.join("."),

      message: issue.message,
    })),
  };
};

export default handleZodError;