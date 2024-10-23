import prismaClient from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req : NextRequest) {
    const session = await getServerSession();
    const userEmail = session?.user?.email || ""

    const userId = await prismaClient.user.findFirst({
        where : {
            email : userEmail ?? ""
        }, 
        select : {
            id : true,
        }
    })

    if(!userId) {
       return NextResponse.json({
        message : "Unauthenticated"
       }, {
        status : 403
       }) 
    }

    // // const streams = await prismaClient.stream.findMany({
    // //     where : {
    // //         userId : user.id ?? ""
    // //     }, 
    // //     include : {
    // //         _count : {
    // //             select : {
    // //                 upvotes : true
    // //             }
    // //         }, 
    // //         upvotes : {
    // //             where : {
    // //                 userId : user.id
    // //             }
    // //         }
    // //     }
    // // })
    // return NextResponse.json({
    //     streams : streams.map(({_count, ...rest}) => ({
    //         ...rest,
    //         upvotes : _count.upvotes, 
    //         haveUpvoted : rest.upvotes.length ? true : false, 
    //     }))
    // })
    return NextResponse.json({
        message : "success",
        id : userId.id
    })
}