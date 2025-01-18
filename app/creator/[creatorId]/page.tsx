"use client"
import { creatorState } from "@/app/atom";
import EnhancedStreamViewCreator from "@/app/components/StreamViewCreator";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRecoilValue } from "recoil";

export default function Creator(){
    const creatorId = useRecoilValue(creatorState);

    return <div>
        <EnhancedStreamViewCreator creatorId={creatorId} playVideo={false}/>
    </div> 
}
