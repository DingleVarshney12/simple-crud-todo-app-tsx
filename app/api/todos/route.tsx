import connectDb from "@/lib/db";
import { rateLimit } from "@/lib/rateLimiter";
import Todo from "@/models/todo.model";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (await rateLimit(ip, 5, 60)) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    await connectDb();
    const { title } = await req.json();
    if (!title)
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 }
      );

    const todo = await Todo.create({ title, userId: session.user.id });
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDb();
    const todos = await Todo.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDb();
    const { searchParams } = new URL(req.url);
    const todoId = searchParams.get("todoId");
    if (!todoId)
      return NextResponse.json(
        { message: "Todo ID required" },
        { status: 400 }
      );

    const todo = await Todo.findById(todoId);
    if (!todo)
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });

    if (todo.userId.toString() !== session.user.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    await todo.deleteOne();
    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDb();
    const { searchParams } = new URL(req.url);
    const todoId = searchParams.get("todoId");
    const { title, completed } = await req.json();

    const todo = await Todo.findById(todoId);
    if (!todo)
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });

    if (todo.userId.toString() !== session.user.id)
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    todo.title = title ?? todo.title;
    todo.completed = completed ?? todo.completed;
    await todo.save();

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
