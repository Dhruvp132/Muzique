"use client"
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import StreamView from "../components/StreamView"
// import { useCreator } from '../contexts/CreatorContext'
// import { useEffect } from 'react';

export default function Component() {
  // const {creator, setCreator} = useCreator(); 

  // useEffect(()=> {
  //     const res = await fetch("/streams/my", {
  //       method : "GET", 
  //       credentials : 'include',
  //     })
  //     const json = await res.json(); 
  //     setCreator(json.id);
  // }, [])
  return <main>
      <StreamView creatorId = {"093cbe9e-9335-4602-a61f-3d570db27147"} playVideo = {true}/>
    </main>
}