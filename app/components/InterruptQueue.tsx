/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
//@ts-ignore
import { ChevronUp, ChevronDown, Play, Share2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { YT_REGEX } from '../lib/utils';
//@ts-ignore
import YouTubePlayer from 'youtube-player';
import { useRouter } from 'next/navigation';
import { useInterrupt } from '../contexts/InterruptContext';

interface Video {
    id: string;
    type: string;
    url: string;
    extractedId: string;
    title: string;
    smallImg: string;
    bigImg: string;
    active: boolean;
    userId: string;
    upvotes: number;
    haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function InterruptQueue({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean;
}) {
    const [inputLink, setInputLink] = useState('');
    const [queue, setQueue] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(false);
    const [playNextLoader, setPlayNextLoader] = useState(false); // Added playNextLoader state
    const videoPlayerRef = useRef<HTMLDivElement>(null);
    const [songLimit, setSongLimit] = useState<number | null>(null);
    const [songCount, setSongCount] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const { setInterrupt} = useInterrupt(); 
    const router = useRouter();

    const navigateToDashboard = () => {
        router.push('/dashboard');
    };

    async function refreshStreams() {
        try {
            const res = await fetch(`/api/u/?creatorId=${creatorId}`, {
                method : "GET", 
                credentials: "include"
            });
            const json = await res.json();
            setSongLimit(json.songLimitOfUser);
            console.log(json.streams);
            setQueue(json.streams.sort((a: Video, b: Video) => b.upvotes - a.upvotes));
            
            const streamsFromCreator = await fetch(`/api/streams/?creatorId=${creatorId}`, {
                credentials: "include"
            });
            
            const streams = await streamsFromCreator.json();
            setCurrentVideo(video => {
                if (video?.id === streams.activeStream?.stream?.id) {
                    return video;
                }
                return streams.activeStream.stream;
            });
        } catch (error) {
            console.error("Error fetching streams:", error);
        }
    }

    useEffect(() => {
        refreshStreams();
        const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval); // Clean up the interval on unmount
    }, []);

    useEffect(() => {
        if (!videoPlayerRef.current || !currentVideo) {
            return;
        }
        const player = YouTubePlayer(videoPlayerRef.current);
        
        player.loadVideoById(currentVideo.extractedId);
        player.playVideo();

        function eventHandler(event: any) {
            if (event.data === 0) {
                playNext();
            }
        }

        player.on('stateChange', eventHandler);
        
        return () => {
            player.off('stateChange', eventHandler); // Clean up the event listener
            player.destroy();
        };
    }, [currentVideo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (songLimit !== null && songCount >= songLimit) {
            setShowAlert(true);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/u/?creatorId=${creatorId}`, {
                method: "POST",
                body: JSON.stringify({ creatorId, url: inputLink }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const newVideo = await res.json();
            setQueue(prevQueue => [...prevQueue, newVideo]);
            setSongCount(prevCount => prevCount + 1); // Increment the song count
        } catch (error) {
            console.error("Error adding video:", error);
            toast.error('Failed to add video. Please try again.');
        } finally {
            setLoading(false);
            setInputLink('');
        }
    };

    const handleCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/u/`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (json.success) { 
                alert("Error occurred");
                router.refresh();
            } else {
                alert("Error occurred");
            }
        } catch (error) {
            console.error("Error canceling:", error);
            alert("Error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleInterrupt = async (e: React.FormEvent) => {
        e.preventDefault();
        setInterrupt(Math.random);
        router.push(`/creator/${creatorId}`)
    };

    const handleVote = async (id: string, isUpvote: boolean) => {
        const newQueue = queue.map(video => 
            video.id === id 
                ? { 
                    ...video, 
                    upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                    haveUpvoted: !video.haveUpvoted
                } 
                : video
        ).sort((a, b) => b.upvotes - a.upvotes);
        
        setQueue(newQueue);

        try {
            await fetch(`/api/u/${isUpvote ? "upvote" : "downvote"}`, {
                method: "POST",
                body: JSON.stringify({ streamId: id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const playNext = async () => {
        if (queue.length > 0) {
            try {
                setPlayNextLoader(true);
                const response = await fetch('/api/streams/next', { method: "GET" });
                const json = await response.json();
                setCurrentVideo(json.stream);
                setQueue(prevQueue => prevQueue.filter(x => x.id !== json.stream?.id));
            } catch (error) {
                console.error("Error playing next:", error);
            } finally {
                setPlayNextLoader(false);
            }
        }
    };

    const handleShare = () => {
        const shareableLink = `${window.location.hostname}/creator/${creatorId}`;
        navigator.clipboard.writeText(shareableLink).then(() => {
            toast.success('Link copied to clipboard!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }).catch(err => {
            console.error('Could not copy text: ', err);
            toast.error('Failed to copy link. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        });
    };

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
                        <Button disabled={loading} onClick={handleSubmit} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">{loading ? "Loading..." : "Add to Queue"}</Button>
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
                                        {playVideo ? <>
                                        {/* @ts-ignore */}
                                            <div ref={videoPlayerRef} className='w-full' />
                                            {/* <iframe width={"100%"} height={300} src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`} allow="autoplay"></iframe> */}
                                        </> : <>
                                        <img 
                                            src={currentVideo.bigImg} 
                                            className="w-full h-72 object-cover rounded"
                                        />
                                        <p className="mt-2 text-center font-semibold text-white">{currentVideo.title}</p>
                                    </>}
                                </div>) : (
                                    <p className="text-center py-8 text-gray-400">No video playing</p>
                                )}
                            </CardContent>
                        </Card>
                        {playVideo && <Button disabled={playNextLoader} onClick={playNext} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                            <Play className="mr-2 h-4 w-4" /> {playNextLoader ? "Loading..." : "Play next"}
                        </Button>}
                        </div>
                    </div>
                </div>
                <div className='col-span-2 pl-4 lg:pr-2'>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Your Playlist</h2>
                        <Button disabled={loading} onClick={handleInterrupt} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">{loading ? "Loading..." : "Interrupt"}</Button>
                        <Button disabled={loading} onClick={handleCancel} type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">{loading ? "Loading..." : "Cancel"}</Button>
                        {queue.length === 0 && <Card className="bg-gray-900 border-gray-800 w-full">
                            <CardContent className="p-4"><p className="text-center py-8 text-gray-400">No videos in queue</p></CardContent></Card>}
                        {queue.map((video) => (
                            <Card key={video.id} className="bg-gray-900 border-gray-800">
                            <CardContent className="p-4 flex items-center space-x-4">
                                <img 
                                src={video.smallImg}
                                alt={`Thumbnail for ${video.title}`}
                                className="w-30 h-20 object-cover rounded"
                                />
                                <div className="flex-grow">
                                <h3 className="font-semibold text-white">{video.title}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleVote(video.id, video.haveUpvoted ? false : true)}
                                    className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                                    >
                                    {video.haveUpvoted ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                                    <span>{video.upvotes}</span>
                                    </Button>
                                </div>
                                </div>
                            </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                
            </div>
            {showAlert && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-white">Song Limit Reached</h2>
              <p className="mb-4 text-gray-400">You have reached the maximum number of songs you can add.</p>
              <div className="flex justify-between">
                <Button 
                  onClick={() => setShowAlert(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Close
                </Button>
                <Button 
                  onClick={navigateToDashboard}
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
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