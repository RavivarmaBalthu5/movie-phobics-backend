// src/handlers/handler.js

exports.handler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from handler.js!" }),
    };
  };
  