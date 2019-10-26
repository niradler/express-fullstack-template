const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const generateHash = password => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    created_at: Date,
    updated_at: Date
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

userSchema.statics.authenticate = async function(email, password) {
  try {
    const users = await this.find({ email });
    const user = users[0];
    if (!user) throw new Error("not found!");
    const compare = await comparePassword(password, user.password);

    if (!compare) throw new Error("authentication error.");
    const json = user.toJSON();
    delete json.password;
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

userSchema.statics.signup = async function(email, password) {
  try {
    const hash = await generateHash(password);
    const user = await this.create({
      email,
      password: hash,
      type: "user"
    });
    const json = user.toJSON();
    delete json.password;
    return json;
  } catch (error) {
    console.error({ error });
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
