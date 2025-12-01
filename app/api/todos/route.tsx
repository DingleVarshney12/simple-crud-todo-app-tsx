import connectDb from "@/lib/db";
import Todo from "@/models/todo.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { title, userId } = await req.json();
    if (!title || !userId) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );
    }
    const todo = await Todo.create({ title, userId });
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
