const { getMovies } = require("../services/db");
const _ = require("lodash");
const { prepareProjections } = require("../utils/utils");
exports.handler = async (event) => {
  try {
    let queryStringParameters = event?.queryStringParameters
    let projections = {};
    let response = {};
    let projectionArray = queryStringParameters?.projections?.split(",");
    if (!_.isEmpty(projectionArray)) {
      projections = prepareProjections(projectionArray)
    }
    if (!_.isEmpty(queryStringParameters) && _.has(queryStringParameters, "movies") && queryStringParameters?.movies) {
      response = await getMovies(projections);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: response }),
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e }),
    };
  }
};
