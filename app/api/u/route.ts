/* eslint-disable @typescript-eslint/ban-ts-comment */

//_____________ VIM ++++++++++++++
// here the userId in the schema is the creatorId in the schema so when making the req 
// make sure to give the userId in the schema as the creatorid 

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import {Session} from "next-auth"
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import prismaClient from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

const MAX_QUEUE_LEN = 20;

export async function POST(req: NextRequest) {
    try {
        const session = (await getServerSession(authOptions)) as Session | null;
        const signedUser = session?.user?.email ?? ""
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX)
        if (!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            })    
        }

        const extractedId = data.url.split("?v=")[1];
        //TODO : add only if stream is not present? optional
        const res = await youtubesearchapi.GetVideoDetails(extractedId);

        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);

        const existingActiveStream = await prismaClient.stream.count({
            where: {
                userId: data.creatorId
            }
        })

        const getUserSongLimit = await prismaClient.user.findFirst({
            where : {
                email : signedUser, 
                paid : true, 
            },
            select : {
                songLimit : true, 
                songAdded : true
            }
        })

        const songLimitOfUser : number = getUserSongLimit?.songLimit ?? 0;
        if(songLimitOfUser === 0) {
            return NextResponse.json({
                message : "You have reached your song limit",
                songLimitOfUser,
            })
        }

        if (existingActiveStream > MAX_QUEUE_LEN ) {
            return NextResponse.json({
                message: "Already at limit",
                songLimitOfUser : 0,
            }, {
                status: 411
            })
        }

        const getIdFromEmail = await prismaClient.user.findFirst({
            where : {
                email : signedUser ?? ""
            },
        })
        const userId = getIdFromEmail?.id ?? ""

        console.log("(UU()(U)(U)(U)(U)(U)(U)(U)(U)(U)(U)(U)(U)(U")
        console.log(userId)
        console.log(data.creatorId)

        const stream = await prismaClient.stream.create({
            data: {
                addedById : userId, 
                userId: data.creatorId,
                url: data.url,
                extractedId,
                paidInterrupt : true, 
                type: "Youtube",
                title: res.title ?? "Cant find video",
                smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
                bigImg: thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"
            }
        });

        const user = await prismaClient.user.findUnique({
            where: {
              email: signedUser
            },
            select: {
              songLimit: true,
              songAdded: true
            }
        });

        const songLimit = user?.songLimit ?? 0;
        if (songLimit > 0) {
            await prismaClient.user.update({
              where: {
                email: signedUser
              },
              data: {
                songAdded: { increment: 1 },  
                songLimit: { decrement: 1 }   
              }
            });
          } else {
            // Handle case when songLimit is 0 or less
            console.log('No more songs can be added.');
          }

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0,
            songLimitOfUser, 
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            songLimitOfUser : 0,
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }
}

export async function GET(req: NextRequest) {
    try {
        const creatorId = req.nextUrl.searchParams.get("creatorId");
        const session = (await getServerSession(authOptions)) as Session | null;
        // TODO: You can get rid of the db call here 
        const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? ""
            }
        });

        const getUserSongLimit = await prismaClient.user.findFirst({
            where : {
                email : user?.email, 
                paid : true, 
            },
            select : {
                songLimit : true, 
                songAdded : true
            }
        })

        const songLimitOfUser : number = getUserSongLimit?.songLimit ?? 0;
        if (!user) {
            return NextResponse.json({
                message: "Unauthenticated"
            }, {
                status: 403
            })
        }

        if (!creatorId) {
            return NextResponse.json({
                message: "Error"
            }, {
                status: 411
            })
        }

        const getIdFromEmail = await prismaClient.user.findFirst({
            where : {
                email : user.email ?? ""
            },
        })
        
        
        const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
            where: {
                addedById: getIdFromEmail?.id,
                played: false
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes: {
                    where: {
                        userId: user.id
                    }
                }
            }
        }), prismaClient.currentStream.findFirst({
            where: {
                userId: creatorId
            },
            include: {
                stream: true
            }
        })])

        return NextResponse.json({
            streams: streams.map(({_count, ...rest}) => ({
                ...rest,
                upvotes: _count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false
            })),
            songLimitOfUser,
            activeStream
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            e
        })
    }
}



export async function DELETE() {
    try { 
        const session = (await getServerSession(authOptions)) as Session | null;
        // TODO: You can get rid of the db call here 
        const user = session?.user?.email ?? ""
        const getUserId = await prismaClient.user.findUnique({
            where : {
                email : user, 
            }
        })
        const userId = getUserId?.id ?? ""
        await prismaClient.stream.deleteMany({
            where : {
                addedById : userId, 
                paidInterrupt : true, 
            }
        })

        return NextResponse.json({
            success : "true", 
            message : "deleted the queue created by the Paid user "
        })
    } catch(e) {
        console.log(e); 
        return NextResponse.json({
            success : "false", 
            message : "Error Occurred"
        })
    }
}