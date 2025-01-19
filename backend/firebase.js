var admin = require("firebase-admin");

var serviceAccount = require("./task-planner-app-3cfaa-firebase-adminsdk-uftou-b7b92a9fcf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;