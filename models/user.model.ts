import mongoose from "mongoose";
interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;