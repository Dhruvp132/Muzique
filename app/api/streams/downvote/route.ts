/* eslint-disable @typescript-eslint/no-unused-vars */
import prismaClient from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId : z.string(),
})
export async function POST(req : NextRequest) {//thats how you get the user's data from the session 
    //TODO : Replace this with id everyone
    //TODO : you can get rid of the db call here
    const session = await getServerSession();
    
    const user = await prismaClient.user.findFirst({
        where : {
            email : session?.user?.email ?? ""
        }
    })

    if(!user) {
       return NextResponse.json({
        message : "Unauthenticated"
       }, {
        status : 403
       }) 
    }

    try {
        const data = UpvoteSchema.parse(await req.json())
        await prismaClient.upvote.delete({
            where : {
                userId_streamId : {
                    userId : user.id, 
                    streamId : data.streamId,  
                } 
            }
        })
        return NextResponse.json({
            message : "DONE!"
        })
    } catch (e) {
        return NextResponse.json({
            message : "Error while upvoting"
        }, {
            status : 403
        })
    }
}

