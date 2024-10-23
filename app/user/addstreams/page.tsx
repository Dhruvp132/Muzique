/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import InterruptQueue from "@/app/components/InterruptQueue";
import { useUserCreator } from "@/app/contexts/CreatorContext";

export default function Creator(
//     {
//     params : {
//         userCreator
//     }
// } : {
//     params : {
//         userCreator : string;
//     }
// }
) {

    const {userCreator} = useUserCreator(); 

    return <main>
        <InterruptQueue creatorId = {"093cbe9e-9335-4602-a61f-3d570db27147"} playVideo = {false}/>
    </main> 
}
