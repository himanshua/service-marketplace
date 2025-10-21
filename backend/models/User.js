/**User Model
 * - Stores name, email, hashed password, role (normal, expert, admin)
 * - Autmatically hashes password on create.update if changed
 * - Adds a method to compare a plain passwords
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for a User

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // data type: String
      required: true,
      trim: true, // trim whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // trim whitespace
      lowercase: true, // convert to lowercase
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
userSchema.pre("save", async function () {
  //if password not modified, name or email modified, so skip password hashing
  if (!this.isModified("password")) return;

  //Now Genrate salt and hash password
  //Note this only write in memory not in DB
  this.password = await bcrypt.hash(this.password, 10);
});

//instance method to compare passwords
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

//instance method to compare passwords
userSchema.methods.matchPassword = userSchema.methods.comparePassword;


//Export model so we can use
// mongose automatically creates users collection in MongoDB
// ✅ Correct export
export default mongoose.model("User", userSchema);
//module.exports = mongoose.model("User", userSchema); --- IGNORE ---