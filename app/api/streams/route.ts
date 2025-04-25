/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
//@ts-ignore
// import youtubesearchapi from "youtube-search-api";
import {Session} from "next-auth"
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import prismaClient from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth";
import { Client } from "youtubei";

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

const MAX_QUEUE_LEN = 20;

export async function POST(req: NextRequest) {
    try {   
        const data = CreateStreamSchema.parse(await req.json());
        console.log(data)
        const isYt = data.url.match(YT_REGEX)
        if (!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            })    
        }

        const extractedId = data.url.split("?v=")[1];

        let videoTitle = "Unknown Video";
        let smallImgUrl = `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`;
        let bigImgUrl = `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`;
        
        //TODO : add only if stream is not present? optional
        // const res = await youtubesearchapi.GetVideoDetails(extractedId);
        // console.log(res); 
        // console.log("===========")
        // console.log(res.thumbnail);
        // const thumbnails = await res.thumbnail.thumbnails;
        // console.log(thumbnails);
        // thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);


        //using youtubei for gettiing the video deatils 
         // safer extraction via regex
        // const youtube = new Client();               // initialize InnerTube
        // const video = await youtube.getVideo(extractedId);  // fetch details :contentReference[oaicite:3]{index=3}

        // // sort thumbnails by width ascending
        // if (!video) {
        //     throw new Error("Failed to fetch video details");
        // }
        // const thumbnails = video.thumbnails.sort((a, b) => a.width - b.width);

        try {
            // First attempt with youtubei
            const youtube = new Client();
            const video = await youtube.getVideo(extractedId);
            
            if (video && video.title && video.thumbnails && video.thumbnails.length > 0) {
                // If successful, use the data from youtubei
                videoTitle = video.title ?? uuidv4();
                const thumbnails = video.thumbnails.sort((a, b) => a.width - b.width);
                
                if (thumbnails.length > 1) {
                    smallImgUrl = thumbnails[Math.max(0, thumbnails.length - 2)].url;
                }
                
                bigImgUrl = thumbnails[thumbnails.length - 1].url;
            }
        } catch (apiError) {
            console.log("YouTube API error:", apiError);
            // Fallback to direct URL construction - no API needed
            // These URLs should work for most YouTube videos
        }

        console.log("user - 1")
        const existingActiveStream = await prismaClient.stream.count({
            where: {
                userId: data.creatorId
            }
        })

        if (existingActiveStream > MAX_QUEUE_LEN) {
            return NextResponse.json({
                message: "Already at limit"
            }, {
                status: 411
            })
        }

        // const getUserIdFromEmail = await prismaClient.user.findFirst({
        //     where : {
        //         email : signedUser || ""
        //     }, 
        // })
        // const userId = getUserIdFromEmail?.id ?? ""
        // console.log("=0======000000000000===========00000000000000")
        // console.log(data.creatorId); 

        console.log("user- 2");
        // const stream = await prismaClient.stream.create({
        //     data: {
        //         addedById : data.creatorId, 
        //         userId: data.creatorId,
        //         url: data.url,
        //         extractedId,
        //         type: "Youtube",
        //         title: res.title ?? "Cant find video",
        //         smallImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg",
        //         bigImg: thumbnails[thumbnails.length - 1].url ?? "https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_640.jpg"
        //     }
        // });

        const stream = await prismaClient.stream.create({
            data: {
              addedById: data.creatorId,
              userId: data.creatorId,
              url: data.url,
              extractedId,
              type: "Youtube",
              title: videoTitle,
                smallImg: smallImgUrl,
                bigImg: bigImgUrl
            }
          });

        console.log("user- 3")
        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })
    } catch(e) {
        console.log(e);
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {
            status: 411
        })
    }

}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = (await getServerSession(authOptions)) as Session | null;
     // TODO: You can get rid of the db call here 
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
        })
    }

    if (!creatorId) {
        return NextResponse.json({
            message: "Error creator Id not found"
        }, {
            status: 411
        })
    }

    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId,
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
    // console.log('fs;ldkajdlksjflk;ajsdf')
    // console.log(activeStream)
    return NextResponse.json({
        streams: streams.map(({_count, ...rest}) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    })
}
function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
