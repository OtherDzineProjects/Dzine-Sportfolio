const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const userRoutes = require("./routes/user");
const systemRoutes = require("./routes/systemAccess");
const authMiddleware = require('./common/authMiddleware');
const organizationRoute = require('./routes/organization');
const organizationMemberRoute = require('./routes/organizationMember');
const organizationActivityRoute = require('./routes/organizationActivity');
const userBasicDetailRoute = require('./routes/basicUserDetail');
const recordsRoute = require('./routes/records');
const regionMastersRoute = require('./routes/regionMasters');
const qualificationDetailRoute = require('./routes/userQualificationDetail');
const userContactDetailRoute = require('./routes/userContactDetail');
const commonRoute = require('./routes/commonFunctions');
const activityRoute = require('./routes/activity');
const organizationDepartmentRoute = require('./routes/organizationDepartment');
const organizationTeamRoute = require('./routes/organizationTeam');
const organizationDepartmentTeamRoute = require('./routes/organizationDepartmentTeam');
const organizationDepartmentMemberRoute = require('./routes/organizationDepartmentMember');
const organizationTeamDetailRoute = require('./routes/organizationTeamDetail');
const activityDetailRoute = require('./routes/activityDetail');
const organizationFacilityRoute = require('./routes/organizationFacility');
const organizationRoleRoute = require('./routes/organizationRole');
const organizationUserRoleRoute = require('./routes/organizationUserRole');
const notificationRoute = require('./routes/notification');
const PORT = process.env.PORT || 3001;
const globalConstants = require('./common/globalConstants');
const { executeQuery } = require("./common/dbConnect");
const app = express();

var allowedOrigins = globalConstants.allowedOrigins;
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin

      // if (!origin) return callback(null, true);
      // if (allowedOrigins.indexOf(origin) === -1) {
      //   var msg = globalConstants.corsMessage;
      //   return callback(new Error(msg), false);
      // }
      // return callback(null, true);
      callback(null, true);
    },
  })
);

app.use(express.json());
app.use(bodyParser.json());

// app.use('/' , authMiddleware.authentication);
app.use((request, response, next) => {
  if (request.url.startsWith(globalConstants.apidocsSwagger)  || request.url === globalConstants.loginEndpoint || request.url === globalConstants.signupEndpoint
  || request.url === globalConstants.SendOtpEndpoint || request.url === globalConstants.VerifyOtpEndpoint ) {
    return next(); // Skip middleware and continue to next middleware or route handler
  }else{
    authMiddleware.authentication(request, response, next);
  }
});
app.use(authMiddleware.errorHandler);


// swagger definition
var swaggerDefinition = {
	info: {
         title: 'Sportfolio with Swagger',
         version: '1.0.0',
         description: 'Sportfolio with Swagger documentation',
       },
	// host: config[config.env].host + ":" + config[config.env].port,
  host: globalConstants.serverIp + ":" + PORT,

	basePath: "/",
	swagger: "2.0",
	paths: {},
	definitions: {},
	responses: {},
	parameters: {},
	securityDefinitions: {}
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJsdoc(options);

// Setup Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



//Routes
app.use(systemRoutes);
app.use(activityRoute);
app.use(organizationRoute);
app.use(userBasicDetailRoute);
app.use(qualificationDetailRoute);
app.use(userContactDetailRoute);
app.use(userRoutes);
app.use(recordsRoute);
app.use(regionMastersRoute);
app.use(commonRoute);
app.use(organizationActivityRoute)
app.use(organizationMemberRoute)
app.use(organizationDepartmentRoute)
app.use(organizationDepartmentMemberRoute)
app.use(organizationTeamRoute)
app.use(organizationDepartmentTeamRoute)
app.use(organizationTeamDetailRoute)
app.use(activityDetailRoute)
app.use(organizationFacilityRoute)
app.use(organizationRoleRoute)
app.use(organizationUserRoleRoute)
app.use(notificationRoute)

app.listen(PORT, () => {
  console.log(`${globalConstants.serverRunPort}, ${PORT}`);
});
