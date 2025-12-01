import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const { name, email, password } = await request.json();
    const userExist = await User.findOne({ email });
    if (userExist) {
      return NextResponse.json(
        {
          message: "User email already Exist",
        },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be atleast 6 Character",
        },
        { status: 400 }
      );
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
