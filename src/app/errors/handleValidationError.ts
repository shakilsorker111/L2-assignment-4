const handleValidationError = () => {
  return {
    statusCode: 400,

    message: "Validation Error",

    errorDetails: [],
  };
};

export default handleValidationError;