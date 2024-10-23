import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prismaClient from "@/app/lib/db";
import {Session} from "next-auth"
import { authOptions } from "@/app/lib/auth";

export async function GET() {
  try {
    // Pass the request and auth options to get the session
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "You must be logged in to retrieve space information" },
        { status: 401 }
      );
    }

    // Fetch user ID based on email from the session
    const userId = await prismaClient.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Host ID retrieved successfully",
        id: userId.id,
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unauthorized", error: e },
      { status: 400 }
    );
  }
}
