const mongoose = require("mongoose"); //import to interact with mongoose DB
const bcrypt = require("bcryptjs"); // import for password encryption hash securely

// Define the schema for a User

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // data type: String
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["usernormal", "userexpert", "useradmin"], // added admin
      default: "usernormal",
    },
  },
  { timestamps: true }
);

//Pre save hook runs before saving user to DB
userSchema.pre("save", async function (next) {
  //if password not modified, name or email modified, so skip password hashing
  if (!this.isModified("password")) return next();

  //Now Genrate salt and hash password
  //Note this only write in memory not in DB
  this.password = await bcrypt.hash(this.password, 10);
  next(); // contimue with save to DB
  //After this next() runs mongose writes or saves in memory the user with password
});

//instance method to compare passwords
userSchema.methods.matchPassword = async function (entered) {
  //bcrympt compare return true if match else false
  return bcrypt.compare(entered, this.password);
};

//Export model so we can use
// mongose automatically creates users collection in MongoDB
// ✅ Correct export
module.exports = mongoose.model("User", userSchema);
