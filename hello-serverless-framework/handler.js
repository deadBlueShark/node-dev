'use strict';

module.exports.hello = async event => {
  let greet = `Hello ${process.env.AUTHOR_NAME}`;
  console.log(greet);
  return {
    statusCode: 200,
    body: { message: greet }
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
