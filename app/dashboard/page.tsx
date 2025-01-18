/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import StreamView from "../components/StreamView"
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export default function Component() {
  //to get the id in the frontend we are using the getSession 
  const [creatorId, setCreatorId] = useState<string >("");

  useEffect(() => {
    // Fetch the session on component mount
    const fetchSession = async () => {
      const session = await getSession();
      if (session && session.user) {  
        setCreatorId(session?.user?.id || ""); 
      }
    };

    fetchSession();
  }, []);

  if(!creatorId) return <div>Loading...</div>
  //if there is no loader present then what will happen is that 
  // the page will be empty until the creatorId is fetched
  return <main>
      <StreamView creatorId = {creatorId} playVideo = {true}/>
    </main>
}