// src/handlers/handler.js

const { getData } = require("../services/db");

exports.handler = async (event) => {
  try {
    console.log('Event', JSON.stringify(event, null, 2));
    const data = await getData();
    console.log('Data retrieved:', data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: JSON.stringify(event, null, 2) }),
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: JSON.stringify(e, null, 2) }),
    };
  }
};
