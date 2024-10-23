/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent } from "@/app/components/ui/card"
//@ts-ignore
import { ChevronUp, ChevronDown, Play, Share2 } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { YT_REGEX } from '../lib/utils'
//@ts-ignore
import YouTubePlayer from 'youtube-player';
import { useInterrupt } from '../contexts/InterruptContext'

interface Video {
  id: string
  type: string
  url: string
  extractedId: string
  title: string
  smallImg: string
  bigImg: string
  active: boolean
  userId: string
  upvotes: number
  haveUpvoted: boolean
  paidInterrupt: boolean
  createdAt : Date
}

const REFRESH_INTERVAL_MS = 10 * 1000

export default function EnhancedStreamView({ creatorId, playVideo = false }: { creatorId: string; playVideo: boolean }) {
  const [inputLink, setInputLink] = useState('')
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [playNextLoader, setPlayNextLoader] = useState(false)
  const videoPlayerRef = useRef<HTMLDivElement>(null)
  const { interrupt } = useInterrupt(); 
  
  async function refreshStreams() {
    const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
      credentials: "include"
    })
    const json = await res.json()
    const paidStreams = json.streams
      .filter((stream: Video) => stream.paidInterrupt)
      .sort((a: Video, b: Video) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    const unpaidStreams = json.streams
      .filter((stream: Video) => !stream.paidInterrupt)
      .sort((a: Video, b: Video) => {
        if (a.upvotes === b.upvotes) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        return b.upvotes - a.upvotes
      })  

    setQueue([...paidStreams, ...unpaidStreams])

    setCurrentVideo((video) => {
      if (video?.id === json.activeStream?.stream?.id) {
        return video
      }
      return json.activeStream.stream
    })
  }

  useEffect(() => {
    refreshStreams()
    const interval = setInterval(() => {
      refreshStreams()
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!videoPlayerRef.current || !currentVideo) return

    const player = YouTubePlayer(videoPlayerRef.current)
    player.loadVideoById(currentVideo.extractedId)
    player.playVideo()

    const eventHandler = (event: { data: number }) => {
      if (event.data === 0) {
        playNext()
      }
    }
    player.on('stateChange', eventHandler)

    return () => {
      player.destroy()
    }
  }, [currentVideo])

  //anytime interrupt has been changed just start streaming the next 
  // you can disable this add a new functionality add 
  //like play next songs of your choice 
  useEffect(() => {
    console.log("interrupted..")
    playNext()
  }, [interrupt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/streams/", {
      method: "POST",
      body: JSON.stringify({
        creatorId,
        url: inputLink
      })
    })
    setQueue([...queue, await res.json()])
    setLoading(false)
    setInputLink('')
  }

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(queue.map(video => 
      video.id === id 
        ? { 
            ...video, 
            upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
            haveUpvoted: !video.haveUpvoted
          } 
        : video
    ).sort((a, b) => b.upvotes - a.upvotes))

    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id
      })
    })
  }

  const playNext = async () => {
    if (queue.length > 0) {
      try {
        setPlayNextLoader(true)
        const data = await fetch('/api/streams/next', {
          method: "GET",
        })
        const json = await data.json()
        setCurrentVideo(json.stream)
        setQueue(q => q.filter(x => x.id !== json.stream?.id))
      } catch(e) {
        console.error("Error playing next video:", e)
      }
      setPlayNextLoader(false)
    }
  }

  const handleShare = () => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }, (err) => {
      console.error('Could not copy text: ', err)
      toast.error('Failed to copy link. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-[rgb(10,10,10)] text-gray-200">
      <div className='flex justify-center'>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 w-screen max-w-screen-xl pt-8">
          <div className='col-span-3'>
            <div className="max-w-4xl mx-auto p-4 space-y-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Add a song</h1>
                <Button onClick={handleShare} className="bg-purple-700 hover:bg-purple-800 text-white">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Paste YouTube link here"
                  value={inputLink}
                  onChange={(e) => setInputLink(e.target.value)}
                  className="bg-gray-900 text-white border-gray-700 placeholder-gray-500"
                />
                <Button disabled={loading} onClick={handleSubmit} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                  {loading ? "Loading..." : "Add to Queue"}
                </Button>
              </form>

              {inputLink && inputLink.match(YT_REGEX) && !loading && (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <LiteYouTubeEmbed title="" id={inputLink.split("?v=")[1]} />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Now Playing</h2>
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    {currentVideo ? (
                      <div>
                        {playVideo ? (
                          <div ref={videoPlayerRef} className='w-full' />
                        ) : (
                          <>
                            <img 
                              src={currentVideo.bigImg} 
                              alt={currentVideo.title}
                              className="w-full h-72 object-cover rounded"
                            />
                            <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-400">No video playing</p>
                    )}
                  </CardContent>
                </Card>
                {playVideo && (
                  <Button disabled={playNextLoader} onClick={playNext} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                    <Play className="mr-2 h-4 w-4" /> {playNextLoader ? "Loading..." : "Play next"}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className='col-span-2 pl-4 lg:pr-2'>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Upcoming Songs</h2>
              {queue.length === 0 && (
                <Card className="bg-gray-900 border-gray-800 w-full">
                  <CardContent className="p-4">
                    <p className="text-center py-8 text-gray-400">No videos in queue</p>
                  </CardContent>
                </Card>
              )}
              {queue.map((video) => (
                <Card 
                  key={video.id} 
                  className={`relative overflow-hidden ${
                    video.paidInterrupt 
                      ? 'bg-black text-white border border-golden-glow' 
                      : 'bg-gray-900 border-gray-800'
                  }`}
                >
                  <CardContent className="p-4 flex items-center space-x-4 relative z-10">
                    <img 
                      src={video.smallImg}
                      alt={`Thumbnail for ${video.title}`}
                      className="w-30 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-white">{video.title}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        {!video.paidInterrupt && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVote(video.id, !video.haveUpvoted)}
                            className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                          >
                            {video.haveUpvoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                            <span>{video.upvotes}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  {video.paidInterrupt && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-golden to-black opacity-30 animate-golden-aurora"></div>
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 animate-golden-border-light"></div>
                      </div>
                      <div className="absolute top-0 right-0 bg-golden text-white px-2 py-1 text-xs font-bold z-20 animate-pulse">
                        PLUS+
                      </div>
                    </>
                  )}
                  {!video.paidInterrupt && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 opacity-20 animate-aurora"></div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}