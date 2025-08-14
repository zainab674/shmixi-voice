import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/ai-call-hero.jpg";
import useConnect from "@/hooks/useConnectHook";
import {
  LiveKitRoom,
  useTracks,
  useLocalParticipant,
  VideoConference,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import CallPopupComponent from "@/components/CallPopupComponent";
import CallDemoCard from "@/components/CallDemoCardComponent";
import { useLocation } from "react-router-dom";

const AICallInterface = () => {
  const location = useLocation();
  const defaultPrompt = location.state?.prompt || `You are the customer manager for our dental clinic. Doctors: Dr. John (Mon–Fri 8:00 AM–12:00 PM) and Dr. Andrew (Mon–Fri 10:00 AM–9:00 PM).
Services: preventive care—checkups, cleanings, fluoride, sealants; diagnostics—exams, X-rays/3D scans, oral-cancer screenings; restorative—fillings, crowns, bridges; endodontics—root canals; periodontics—scaling/root planing & maintenance; oral surgery—extractions, wisdom teeth, minor biopsies; implants & prosthetics—implants, implant crowns/bridges, dentures/partials; orthodontics—braces, clear aligners, retainers; cosmetic—whitening, bonding, veneers; pediatric—kid exams & sealants; TMJ/bite care—night guards, bite adjustments; emergency—toothache, broken tooth, swelling.
Style: replies must be very short (1 sentence), only the point. Always ask what the customer wants next. If they ask about a topic, give a basic one-line answer, then ask what they want.
Payment: do not take any payment info; say payment will be done at the clinic.
Appointments: ask name and email  then confirm and say: "Your appointment is booked."`;

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [aiPrompt, setAiPrompt] = useState(defaultPrompt);

  const [calComLink, setCalComLink] = useState("");
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle");
  const { toast } = useToast();
  const { token, wsUrl, identity, createToken, setToken } = useConnect();

  // Update prompt when location state changes
  useEffect(() => {
    if (location.state?.prompt) {
      setAiPrompt(location.state.prompt);
    }
  }, [location.state]);

  const handleStartCall = async () => {


    await createToken(aiPrompt, setCallStatus);
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setIsCallActive(false);
    setIsMuted(false);
    setToken(null);
    setCallStatus("idle");
    toast({
      title: "Call Ended",
      description: "The AI call has been terminated.",
    });
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Voice Assistant
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience seamless voice communication with our AI-powered assistant
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Call Interface */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Voice Call Interface
                </CardTitle>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"></div>
              </CardHeader>

              <CardContent className="space-y-6">
                {token && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <LiveKitRoom serverUrl={wsUrl} token={token} connect>
                      <CallPopupComponent
                        setCallStatus={setCallStatus}
                        setIsCallActive={setIsCallActive}
                        callStatus={callStatus}
                        isCallActive={isCallActive}
                        isMuted={isMuted}
                        isAudioEnabled={isAudioEnabled}
                        handleEndCall={handleEndCall}
                        setIsMuted={setIsMuted}
                        setIsAudioEnabled={setIsAudioEnabled}
                      />
                      <RoomAudioRenderer />
                      <StartAudio label="Click to enable audio playback" />
                    </LiveKitRoom>
                  </div>
                )}

                {!token && (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                    <CallDemoCard
                      setIsCallActive={setIsCallActive}
                      callStatus={callStatus}
                      isCallActive={isCallActive}
                      isMuted={isMuted}
                      isAudioEnabled={isAudioEnabled}
                      handleStartCall={handleStartCall}
                    />
                  </div>
                )}
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AICallInterface;