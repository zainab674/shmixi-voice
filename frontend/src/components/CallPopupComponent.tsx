// import { CardContent } from '@/components/ui/card'
// import { Mic, MicOff, Phone, PhoneOff, Sparkles, Volume2, VolumeX } from 'lucide-react'
// import React, { useEffect } from 'react'
// import { Button } from './ui/button'
// import { Badge } from './ui/badge'
// import { ConnectionState, Track } from 'livekit-client';
// import { useConnectionState, useLocalParticipant, useRoomContext, useTracks } from '@livekit/components-react';
// import { useToast } from '@/hooks/use-toast'


// const CallPopupComponent = ({ setIsCallActive, setCallStatus, callStatus, isCallActive, isMuted, isAudioEnabled, handleEndCall, setIsAudioEnabled, setIsMuted }) => {
//     const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone], {
//         onlySubscribed: true,
//     });

//     const { localParticipant } = useLocalParticipant();
//     const roomState = useConnectionState();
//     const room = useRoomContext();
//     const { toast } = useToast();


//     useEffect(() => {
//         // Only set connected when room is connected AND we have received tracks
//         if (roomState === ConnectionState.Connected && tracks.length > 0) {
//             setIsCallActive(true);
//             localParticipant.setMicrophoneEnabled(true);
//             setCallStatus("connected");
//         }

//         if (roomState === ConnectionState.Disconnected && isCallActive) {
//             handleEndCall();
//             setCallStatus("ended");
//         }
//     }, [localParticipant, roomState, tracks]);




//     return (
//         <CardContent>
//             <div className="text-center space-y-6">
//                 {/* Call Status */}
//                 <div className="space-y-2">
//                     <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${callStatus === "connected"
//                         ? "bg-gradient-to-r from-primary to-accent shadow-[var(--shadow-glow)] animate-pulse"
//                         : callStatus === "connecting"
//                             ? "bg-muted animate-pulse"
//                             : "bg-muted"
//                         }`}>
//                         {callStatus === "connected" ? (
//                             <Sparkles className="w-8 h-8 text-white" />
//                         ) : (
//                             <Phone className="w-8 h-8 text-muted-foreground" />
//                         )}
//                     </div>
//                     <p className="text-lg font-medium">
//                         {callStatus === "idle" && "Ready to Connect"}
//                         {callStatus === "connecting" && "Connecting..."}
//                         {callStatus === "connected" && "AI Assistant Active"}
//                         {callStatus === "ended" && "Call Ended"}
//                     </p>
//                 </div>

//                 {/* Call Controls */}
//                 <div className="flex justify-center gap-4">

//                     <div className="flex gap-3">
//                         <Button
//                             variant="destructive"
//                             size="lg"
//                             onClick={handleEndCall}
//                         >
//                             <PhoneOff className="w-5 h-5" />
//                         </Button>
//                     </div>

//                 </div>

//                 {/* Call Features */}
//                 <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500" />
//                         Real-time AI responses
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500" />
//                         WebRTC calling
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-purple-500" />
//                         Voice synthesis
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-orange-500" />
//                         Calendar integration
//                     </div>
//                 </div>
//             </div>
//         </CardContent>
//     )
// }

// export default CallPopupComponent




import { CardContent } from '@/components/ui/card'
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Volume2, VolumeX, Loader2, CheckCircle, Wifi } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ConnectionState, Track } from 'livekit-client';
import { useConnectionState, useLocalParticipant, useRoomContext, useTracks } from '@livekit/components-react';
import { useToast } from '@/hooks/use-toast'

const CallPopupComponent = ({
    setIsCallActive,
    setCallStatus,
    callStatus,
    isCallActive,
    isMuted,
    isAudioEnabled,
    handleEndCall,
    setIsAudioEnabled,
    setIsMuted
}) => {
    const [connectionPhase, setConnectionPhase] = useState('')
    const [dots, setDots] = useState('')

    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone], {
        onlySubscribed: true,
    });

    const { localParticipant } = useLocalParticipant();
    const roomState = useConnectionState();
    const room = useRoomContext();
    const { toast } = useToast();

    // Connection phases animation
    useEffect(() => {
        if (callStatus === "connecting") {
            let phaseIndex = 0
            const phases = [
                "Establishing WebRTC connection",
                "Initializing audio pipeline",
                "Connecting to AI assistant",
                "Optimizing voice quality",
                "Finalizing setup"
            ]

            const phaseInterval = setInterval(() => {
                setConnectionPhase(phases[phaseIndex])
                phaseIndex = (phaseIndex + 1) % phases.length
            }, 1200)

            return () => clearInterval(phaseInterval)
        } else {
            setConnectionPhase('')
        }
    }, [callStatus])

    // Animated dots for loading text
    useEffect(() => {
        if (callStatus === "connecting") {
            const dotInterval = setInterval(() => {
                setDots(prev => {
                    if (prev === '...') return ''
                    return prev + '.'
                })
            }, 400)

            return () => clearInterval(dotInterval)
        } else {
            setDots('')
        }
    }, [callStatus])

    useEffect(() => {
        // Only set connected when room is connected AND we have received tracks
        if (roomState === ConnectionState.Connected && tracks.length > 0) {
            setIsCallActive(true);
            localParticipant.setMicrophoneEnabled(true);
            setCallStatus("connected");
        }

        if (roomState === ConnectionState.Disconnected && isCallActive) {
            handleEndCall();
            setCallStatus("ended");
        }
    }, [localParticipant, roomState, tracks]);

    const getStatusIcon = () => {
        switch (callStatus) {
            case "connected":
                return <Sparkles className="w-8 h-8 text-white animate-pulse" />
            case "connecting":
                return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            case "ended":
                return <PhoneOff className="w-8 h-8 text-red-500" />
            default:
                return <Phone className="w-8 h-8 text-muted-foreground" />
        }
    }

    const getStatusText = () => {
        switch (callStatus) {
            case "idle":
                return "Ready to Connect"
            case "connecting":
                return connectionPhase || "Connecting"
            case "connected":
                return "AI Assistant Active"
            case "ended":
                return "Call Ended"
            default:
                return "Ready to Connect"
        }
    }

    const getStatusColor = () => {
        switch (callStatus) {
            case "connected":
                return "bg-gradient-to-r from-primary to-accent shadow-[var(--shadow-glow)]"
            case "connecting":
                return "bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/50"
            case "ended":
                return "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/50"
            default:
                return "bg-muted"
        }
    }

    return (
        <CardContent>
            <div className="text-center space-y-6">
                {/* Call Status with Enhanced Animation */}
                <div className="space-y-4">
                    <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${getStatusColor()} ${callStatus === "connecting" || callStatus === "connected"
                        ? "animate-pulse shadow-xl"
                        : ""
                        }`}>
                        <div className="relative">
                            {getStatusIcon()}

                            {/* Ripple effect for connecting state */}
                            {callStatus === "connecting" && (
                                <>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-75"></div>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-25" style={{ animationDelay: '0.4s' }}></div>
                                </>
                            )}

                            {/* Success ripple for connected state */}
                            {callStatus === "connected" && (
                                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-50"></div>
                            )}
                        </div>
                    </div>

                    {/* Status Text with Animation */}
                    <div className="space-y-2">
                        <p className="text-lg font-medium transition-all duration-300">
                            {getStatusText()}{callStatus === "connecting" ? dots : ""}
                        </p>

                        {/* Connection Progress Indicator */}
                        {callStatus === "connecting" && (
                            <div className="space-y-3">
                                {/* Progress bar */}
                                <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse transition-all duration-1200 w-full"></div>
                                </div>


                            </div>
                        )}

                        {/* Success indicator */}
                        {callStatus === "connected" && (
                            <div className="flex justify-center items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span>AI assistant is listening</span>
                            </div>
                        )}

                        {/* Room state info for debugging */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-gray-400 mt-2">
                                Room: {roomState} | Tracks: {tracks.length}
                            </div>
                        )}
                    </div>
                </div>

                {/* Call Controls */}
                <div className="flex justify-center gap-4">
                    <div className="flex gap-3">
                        {/* Mute Toggle - only show when connected */}
                        {callStatus === "connected" && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    const newMutedState = !isMuted;
                                    localParticipant.setMicrophoneEnabled(!newMutedState);
                                    setIsMuted(newMutedState);
                                }}
                                className={`p-4 rounded-full transition-all duration-200 ${isMuted
                                    ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
                                    : 'bg-green-100 border-green-300 text-green-600 hover:bg-green-200'
                                    }`}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>
                        )}

                        {/* End Call Button */}
                        <Button
                            variant="destructive"
                            size="lg"
                            onClick={handleEndCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl"
                            disabled={callStatus === "connecting"}
                        >
                            <PhoneOff className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Call Features with Enhanced Animation */}
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 group hover:text-green-600 transition-colors duration-200">
                        <Badge
                            variant="outline"
                            className={`w-2 h-2 p-0 rounded-full transition-all duration-300 ${callStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-green-500"
                                }`}
                        />
                        <span className="group-hover:font-medium transition-all duration-200">Real-time AI responses</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:text-blue-600 transition-colors duration-200">
                        <Badge
                            variant="outline"
                            className={`w-2 h-2 p-0 rounded-full transition-all duration-300 ${roomState === ConnectionState.Connected ? "bg-blue-500 animate-pulse" : "bg-blue-500"
                                }`}
                        />
                        <span className="group-hover:font-medium transition-all duration-200">WebRTC calling</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:text-purple-600 transition-colors duration-200">
                        <Badge
                            variant="outline"
                            className={`w-2 h-2 p-0 rounded-full transition-all duration-300 ${callStatus === "connected" ? "bg-purple-500 animate-pulse" : "bg-purple-500"
                                }`}
                        />
                        <span className="group-hover:font-medium transition-all duration-200">Voice synthesis</span>
                    </div>
                    <div className="flex items-center gap-2 group hover:text-orange-600 transition-colors duration-200">
                        <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-orange-500" />
                        <span className="group-hover:font-medium transition-all duration-200">Calendar integration</span>
                    </div>
                </div>

                {/* Connection Quality Indicator */}
                {callStatus === "connected" && tracks.length > 0 && (
                    <div className="flex justify-center items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-2">
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-green-500 rounded animate-pulse"></div>
                            <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-2 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span>Excellent connection quality</span>
                    </div>
                )}
            </div>
        </CardContent>
    )
}

export default CallPopupComponent