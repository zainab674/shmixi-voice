import { CardContent } from '@/components/ui/card'
import { Mic, MicOff, Phone, PhoneOff, Sparkles, Volume2, VolumeX } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const CallDemoCard = ({ setIsCallActive, callStatus, isCallActive, isMuted, isAudioEnabled, handleStartCall, toggleMute, toggleAudio, handleEndCall }) => {



    return (
        <CardContent>
            <div className="text-center space-y-6">
                {/* Call Status */}
                <div className="space-y-2">
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${callStatus === "connected"
                        ? "bg-gradient-to-r from-primary to-accent shadow-[var(--shadow-glow)] animate-pulse"
                        : callStatus === "connecting"
                            ? "bg-muted animate-pulse"
                            : "bg-muted"
                        }`}>

                        <Phone className="w-8 h-8 text-muted-foreground" />

                    </div>
                    <p className="text-lg font-medium">
                        Ready to Connect
                    </p>
                </div>

                {/* Call Controls */}
                <div className="flex justify-center gap-4">
                    <Button
                        variant="hero"
                        size="xl"
                        onClick={handleStartCall}
                        disabled={callStatus === "connecting"}
                        className="group relative overflow-hidden p-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {/* Animated background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

                        {/* Button content */}
                        <div className="relative flex items-center justify-center gap-3">
                            {callStatus === "connecting" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-lg">Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                                    <span className="text-lg">Start AI Call</span>

                                    {/* Pulse effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-200 -z-10"></div>
                                </>
                            )}
                        </div>

                        {/* Ripple effect on click */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150 rounded-xl"></div>
                        </div>
                    </Button>
                </div>


            </div>
        </CardContent>
    )
}

export default CallDemoCard