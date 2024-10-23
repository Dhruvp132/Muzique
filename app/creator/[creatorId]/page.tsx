/* eslint-disable @typescript-eslint/no-unused-vars */
import StreamView from "@/app/components/StreamView";

export default function Creator({
    params : {
        creatorId
    }
} : {
    params : {
        creatorId : string;
    }
}) {

    return <div>
        <StreamView creatorId={"093cbe9e-9335-4602-a61f-3d570db27147"} playVideo={false}/>
    </div> 
}
