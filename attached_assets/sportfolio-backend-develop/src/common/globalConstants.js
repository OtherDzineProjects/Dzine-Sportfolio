
/*
Author     : Abhijith JS
Date       : 16 May 2024
Purpose    : function for defining the connectionString
*/
module.exports = {

  connectionString: {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: "sportfolio",
  },
  corsMessage: "The CORS policy for this site does not allow access from the specified Origin." ,
  loginEndpoint: '/api/user/login',
  signupEndpoint: '/api/user/signup',
  apidocsSwagger: '/api-docs/',
  serverRunPort: `Server is running on PORT: `,
  allowedOrigins: ["https://1b5d71f8-85ba-41ee-ab68-bb483d1ad5df-00-2cq61hkkbs21b.picard.replit.dev"],
  tokenKeyName: "authorization",
  bearerTokenSplitParam: " ",
  emptyString: "",
  andBetweenSpace: " and ",
  filesLimit: 10,
  serverIp: "178.63.193.224",
  // serverIp: "localhost",

  GMAIL_USER: "sportfoliotest123@gmail.com",
  GMAIL_PASSWORD: "hwci ztvm sekv oifo",
  SendOtpEndpoint: '/api/reset/password',
  VerifyOtpEndpoint: '/api/validateTemporaryPassword',
  UpdatePasswordEndpoint: '/api/update/password',
};
