module.exports = function (app) {
  const modelName = "login_history";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
      loginTime: { type: Date, default: Date.now },
      device: { type: String, required: false },   
      ip: { type: String, required: false },        
      browser: { type: String, required: false },  
      userAgent: { type: String, required: false },   
      logoutTime: { type: Date },
    },
    {
      timestamps: true,
    },
  );

  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
