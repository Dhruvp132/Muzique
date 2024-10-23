import prismaClient from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();

    // Check if the user is authenticated
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }

    // Fetch the paid stream first
    const paidStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            paidInterrupt: true, // Assuming you have a field that indicates a paid interrupt
            played: false
        }
    });

    // Fetch the most upvoted stream
    const mostUpvotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            played: false,
            id: {
                not: paidStream?.id // Exclude the paid stream if it exists
            }
        },
        orderBy: {
            upvotes: {
                _count: 'desc'
            }
        }
    });

    // Combine streams into an array
    const streamsToPlay = [];

    if (paidStream) {
        streamsToPlay.push(paidStream);
    }

    if (mostUpvotedStream) {
        streamsToPlay.push(mostUpvotedStream);
    }

    // Set the current stream to the first one in the array (paidStream if exists)
    const currentStream = streamsToPlay[0];

    await Promise.all([
        prismaClient.currentStream.upsert({
            where: {
                userId: user.id
            },
            update: {
                userId: user.id,
                streamId: currentStream?.id 
            },
            create: {
                userId: user.id,
                streamId: currentStream?.id
            }
        }),
        prismaClient.stream.update({
            where: {
                id: currentStream?.id ?? ""
            },
            data: {
                played: true,
                playedTs: new Date()
            }
        })
    ]);

    return NextResponse.json({
        stream: streamsToPlay 
    });
}
