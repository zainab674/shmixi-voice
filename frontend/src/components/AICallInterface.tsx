import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomEvent, ConnectionState } from "livekit-client";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useConnect from "@/hooks/useConnectHook";
import { LiveKitRoom, useRoomContext, RoomAudioRenderer, StartAudio, useConnectionState } from "@livekit/components-react";
import CallPopupComponent from "@/components/CallPopupComponent";
import CallDemoCard from "@/components/CallDemoCardComponent";
import { useLocation } from "react-router-dom";

/* ----------------- helpers ----------------- */
// LiveKit now handles product detection automatically through function tools
// No manual keyword search needed

/* ----------------- component ----------------- */
const AICallInterface = () => {
  const location = useLocation();
  const defaultPrompt = location.state?.prompt || "You are the AI assistant.";

  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [aiPrompt, setAiPrompt] = useState(defaultPrompt);
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle");

  const { toast } = useToast();
  const { token, wsUrl, createToken, setToken } = useConnect();

  const [sharedProducts, setSharedProducts] = useState<Array<{
    productKey: string; itemName: string; url: string; img?: string;
    description: string; price: string; color: string; material: string;
  }>>([]);
  const [bannerMsg, setBannerMsg] = useState("");
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);

  const PLACEHOLDER_IMG = "https://via.placeholder.com/300x300?text=Product";

  useEffect(() => {
    if (location.state?.prompt) setAiPrompt(location.state.prompt);
  }, [location.state]);

  const handleStartCall = async () => {
    await createToken(aiPrompt, setCallStatus);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsMuted(false);
    setToken(null);
    setCallStatus("idle");
    toast({ title: "Call Ended", description: "The AI call has been terminated." });
  };

  const catalog = useMemo(() => ({
    // TOPS - Blouses
    silk_blouse_white: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/silk-white",
      img: "https://via.placeholder.com/300x300?text=White+Silk+Blouse",
      desc: "Elegant white silk blouse with elegant drape and smooth finish. Perfect for office wear and special occasions.",
      price: "£65", color: "white", material: "silk"
    },
    silk_blouse_black: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/silk-black",
      img: "https://via.placeholder.com/300x300?text=Black+Silk+Blouse",
      desc: "Sophisticated black silk blouse with timeless appeal. Ideal for professional settings and evening events.",
      price: "£65", color: "black", material: "silk"
    },
    silk_blouse_navy: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/silk-navy",
      img: "https://via.placeholder.com/300x300?text=Navy+Silk+Blouse",
      desc: "Classic navy silk blouse with professional elegance. Perfect for business meetings and smart casual looks.",
      price: "£65", color: "navy", material: "silk"
    },
    cotton_blouse_white: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/cotton-white",
      img: "https://via.placeholder.com/300x300?text=White+Cotton+Blouse",
      desc: "Crisp white cotton blouse with breathable fabric. Ideal for everyday wear and casual outings.",
      price: "£35", color: "white", material: "cotton"
    },
    cotton_blouse_blue: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/cotton-blue",
      img: "https://via.placeholder.com/300x300?text=Blue+Cotton+Blouse",
      desc: "Fresh blue cotton blouse with comfortable fit. Perfect for spring and summer styling.",
      price: "£35", color: "blue", material: "cotton"
    },
    cotton_blouse_pink: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/cotton-pink",
      img: "https://via.placeholder.com/300x300?text=Pink+Cotton+Blouse",
      desc: "Soft pink cotton blouse with feminine charm. Great for casual and office wear.",
      price: "£35", color: "pink", material: "cotton"
    },
    chiffon_blouse_cream: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/chiffon-cream",
      img: "https://via.placeholder.com/300x300?text=Cream+Chiffon+Blouse",
      desc: "Lightweight cream chiffon blouse with flowing elegance. Perfect for summer and evening wear.",
      price: "£45", color: "cream", material: "chiffon"
    },
    chiffon_blouse_rose: {
      url: "https://www.stylehubfashion.co.uk/collections/blouses/chiffon-rose",
      img: "https://via.placeholder.com/300x300?text=Rose+Chiffon+Blouse",
      desc: "Delicate rose chiffon blouse with romantic appeal. Ideal for special occasions and date nights.",
      price: "£45", color: "rose", material: "chiffon"
    },

    // TOPS - T-Shirts  
    cotton_tshirt_white: {
      url: "https://www.stylehubfashion.co.uk/collections/t-shirts/cotton-white",
      img: "https://via.placeholder.com/300x300?text=White+Cotton+T-Shirt",
      desc: "Classic white cotton t-shirt in basic style. Comfortable everyday wear for any occasion.",
      price: "£20", color: "white", material: "cotton"
    },
    cotton_tshirt_black: {
      url: "https://www.stylehubfashion.co.uk/collections/t-shirts/cotton-black",
      img: "https://via.placeholder.com/300x300?text=Black+Cotton+T-Shirt",
      desc: "Essential black cotton t-shirt with versatile styling. Perfect for layering and casual looks.",
      price: "£20", color: "black", material: "cotton"
    },
    cotton_tshirt_gray: {
      url: "https://www.stylehubfashion.co.uk/collections/t-shirts/cotton-gray",
      img: "https://via.placeholder.com/300x300?text=Gray+Cotton+T-Shirt",
      desc: "Soft gray cotton t-shirt with neutral appeal. Great for everyday comfort and style.",
      price: "£20", color: "gray", material: "cotton"
    },
    polyester_tshirt_blue: {
      url: "https://www.stylehubfashion.co.uk/collections/t-shirts/polyester-blue",
      img: "https://via.placeholder.com/300x300?text=Blue+Polyester+T-Shirt",
      desc: "Durable blue polyester t-shirt with moisture-wicking properties. Perfect for active wear and sports.",
      price: "£18", color: "blue", material: "polyester"
    },
    polyester_tshirt_red: {
      url: "https://www.stylehubfashion.co.uk/collections/t-shirts/polyester-red",
      img: "https://via.placeholder.com/300x300?text=Red+Polyester+T-Shirt",
      desc: "Vibrant red polyester t-shirt with athletic performance. Ideal for gym sessions and outdoor activities.",
      price: "£18", color: "red", material: "polyester"
    },

    // BOTTOMS - Jeans
    denim_jeans_blue_skinny: {
      url: "https://www.stylehubfashion.co.uk/collections/jeans/denim-blue-skinny",
      img: "https://via.placeholder.com/300x300?text=Blue+Skinny+Jeans",
      desc: "Classic blue denim skinny jeans with stretch comfort. Perfect for casual and smart casual looks.",
      price: "£65", color: "blue", material: "denim", fit: "skinny"
    },
    denim_jeans_blue_straight: {
      url: "https://www.stylehubfashion.co.uk/collections/jeans/denim-blue-straight",
      img: "https://via.placeholder.com/300x300?text=Blue+Straight+Jeans",
      desc: "Timeless blue denim straight jeans with classic fit. Ideal for everyday wear and casual styling.",
      price: "£65", color: "blue", material: "denim", fit: "straight"
    },
    denim_jeans_black_skinny: {
      url: "https://www.stylehubfashion.co.uk/collections/jeans/denim-black-skinny",
      img: "https://via.placeholder.com/300x300?text=Black+Skinny+Jeans",
      desc: "Sleek black denim skinny jeans with versatile styling. Perfect for evening wear and formal occasions.",
      price: "£65", color: "black", material: "denim", fit: "skinny"
    },

    // BOTTOMS - Trousers
    cotton_trousers_beige: {
      url: "https://www.stylehubfashion.co.uk/collections/trousers/cotton-beige",
      img: "https://via.placeholder.com/300x300?text=Beige+Cotton+Trousers",
      desc: "Comfortable beige cotton trousers including chinos and dress pants. Perfect for office and casual wear.",
      price: "£45", color: "beige", material: "cotton"
    },
    cotton_trousers_navy: {
      url: "https://www.stylehubfashion.co.uk/collections/trousers/cotton-navy",
      img: "https://via.placeholder.com/300x300?text=Navy+Cotton+Trousers",
      desc: "Professional navy cotton trousers with smart casual appeal. Ideal for business settings and formal events.",
      price: "£45", color: "navy", material: "cotton"
    },
    wool_trousers_gray: {
      url: "https://www.stylehubfashion.co.uk/collections/trousers/wool-gray",
      img: "https://via.placeholder.com/300x300?text=Gray+Wool+Trousers",
      desc: "Premium gray wool trousers for professional wear. Dress pants and formal styles with natural insulation.",
      price: "£120", color: "gray", material: "wool"
    },

    // DRESSES
    cotton_dress_blue_casual: {
      url: "https://www.stylehubfashion.co.uk/collections/casual-dresses/cotton-blue",
      img: "https://via.placeholder.com/300x300?text=Blue+Cotton+Dress",
      desc: "Comfortable blue cotton casual dress in shift style. Perfect for everyday wear and casual occasions.",
      price: "£45", color: "blue", material: "cotton", style: "casual"
    },
    cotton_dress_white_summer: {
      url: "https://www.stylehubfashion.co.uk/collections/summer-dresses/cotton-white",
      img: "https://via.placeholder.com/300x300?text=White+Cotton+Dress",
      desc: "Fresh white cotton summer dress with floral print. Ideal for hot summer days and beach outings.",
      price: "£50", color: "white", material: "cotton", style: "summer"
    },
    silk_dress_black_formal: {
      url: "https://www.stylehubfashion.co.uk/collections/formal-dresses/silk-black",
      img: "https://via.placeholder.com/300x300?text=Black+Silk+Dress",
      desc: "Luxurious black silk formal dress for cocktail and evening events. Elegant and sophisticated styling.",
      price: "£180", color: "black", material: "silk", style: "formal"
    },
    satin_dress_red_evening: {
      url: "https://www.stylehubfashion.co.uk/collections/formal-dresses/satin-red",
      img: "https://via.placeholder.com/300x300?text=Red+Satin+Dress",
      desc: "Glamorous red satin evening dress with beautiful sheen. Perfect for formal events and celebrations.",
      price: "£150", color: "red", material: "satin", style: "evening"
    },
    chiffon_dress_pink_summer: {
      url: "https://www.stylehubfashion.co.uk/collections/summer-dresses/chiffon-pink",
      img: "https://via.placeholder.com/300x300?text=Pink+Chiffon+Dress",
      desc: "Lightweight pink chiffon summer dress with flowing elegance. Ideal for garden parties and summer events.",
      price: "£85", color: "pink", material: "chiffon", style: "summer"
    },

    // OUTERWEAR
    denim_jacket_blue: {
      url: "https://www.stylehubfashion.co.uk/collections/jackets/denim-blue",
      img: "https://via.placeholder.com/300x300?text=Blue+Denim+Jacket",
      desc: "Classic blue denim jacket with timeless appeal. Perfect for casual wear and layering.",
      price: "£65", color: "blue", material: "denim"
    },
    leather_jacket_black: {
      url: "https://www.stylehubfashion.co.uk/collections/jackets/leather-black",
      img: "https://via.placeholder.com/300x300?text=Black+Leather+Jacket",
      desc: "Stylish black leather jacket with edgy appeal. Perfect for adding attitude to any outfit.",
      price: "£180", color: "black", material: "leather"
    },
    cotton_jacket_beige: {
      url: "https://www.stylehubfashion.co.uk/collections/jackets/cotton-beige",
      img: "https://via.placeholder.com/300x300?text=Beige+Cotton+Jacket",
      desc: "Lightweight beige cotton jacket perfect for spring and autumn. Casual and comfortable for everyday wear.",
      price: "£45", color: "beige", material: "cotton"
    },
    wool_coat_gray: {
      url: "https://www.stylehubfashion.co.uk/collections/coats/wool-gray",
      img: "https://via.placeholder.com/300x300?text=Gray+Wool+Coat",
      desc: "Warm gray wool coat with natural insulation. Perfect for cold weather and professional settings.",
      price: "£180", color: "gray", material: "wool"
    },
    cotton_coat_beige_trench: {
      url: "https://www.stylehubfashion.co.uk/collections/coats/cotton-beige-trench",
      img: "https://via.placeholder.com/300x300?text=Beige+Trench+Coat",
      desc: "Classic beige cotton trench coat with timeless elegance. Perfect for spring and autumn styling.",
      price: "£95", color: "beige", material: "cotton", style: "trench"
    }
  }), []);

  const handleAIProductShare = useCallback((productKey: string) => {
    console.log("[UI] handleAIProductShare called with:", productKey);

    const found = catalog[productKey];
    if (!found) {
      console.warn("[UI] Product not found in catalog:", productKey);
      toast({
        title: "Product Not Found",
        description: `Product "${productKey}" is not available in the catalog.`,
        variant: "destructive"
      });
      return;
    }

    const itemName = productKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    console.log("[UI] Found product in catalog:", { productKey, itemName, found });

    setSharedProducts(prev => {
      const next = [
        // ...prev,
        {
          productKey, itemName,
          url: found.url,
          img: found.img,
          description: found.desc,
          price: found.price,
          color: found.color,
          material: found.material,
        },
      ];
      console.log("[UI] Updated sharedProducts:", next);
      return next;
    });

    setBannerMsg(`Showing ${itemName} — want to see any other component?`);
    toast({
      title: "Product Shared",
      description: `AI has shared the ${itemName} with you.`
    });
  }, [catalog, toast]);

  function LiveKitDataBridge() {
    const room = useRoomContext();
    const connectionState = useConnectionState();

    useEffect(() => {
      if (!room) {
        console.log("[UI] No room context available");
        return;
      }

      console.log("[UI] Room connected:", {
        name: room.name,
        participants: room.numParticipants,
        localParticipant: room.localParticipant?.identity,
        connectionState: connectionState
      });

      // Track connection state changes
      const handleConnectionStateChange = () => {
        console.log("[UI] 🔄 Connection state changed:", connectionState);
      };

      const handleParticipantConnected = (participant: any) => {
        console.log("[UI] 👤 Participant connected:", participant.identity);
      };

      const handleParticipantDisconnected = (participant: any) => {
        console.log("[UI] 👤 Participant disconnected:", participant.identity);
      };

      const handler = (payload: Uint8Array) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload));
          console.log("[UI] 🎯 Data received from LiveKit:", msg);
          setLastDataReceived(new Date());

          if (msg?.type === "product.share" && msg.productKey) {
            console.log("[UI] ✅ Processing product.share for:", msg.productKey);
            handleAIProductShare(msg.productKey);
          } else if (msg?.type === "function_call" && msg.function_name === "show_product") {
            // Handle function call responses
            console.log("[UI] ✅ Processing function call response:", msg);
            if (msg.arguments && msg.arguments.product_key) {
              handleAIProductShare(msg.arguments.product_key);
            }
          } else if (msg?.type === "tool_result" && msg.content) {
            // Handle tool results that might contain product info
            console.log("[UI] ✅ Processing tool result:", msg);
            // Try to extract product key from tool result content
            const content = msg.content.toLowerCase();
            if (content.includes("silk_blouse_white")) {
              handleAIProductShare("silk_blouse_white");
            } else if (content.includes("silk_blouse_black")) {
              handleAIProductShare("silk_blouse_black");
            }
          } else {
            console.log("[UI] ❓ Unknown message type:", msg?.type, msg);
          }
        } catch (e) {
          console.error("[UI] ❌ Failed to parse data payload:", e, payload);
        }
      };

      // Attach all event listeners
      room.on(RoomEvent.DataReceived, handler);
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

      console.log("[UI] 🔗 All event listeners attached to room:", room.name);

      // Test data reception by sending a test message
      setTimeout(async () => {
        try {
          if (connectionState === ConnectionState.Connected) {
            console.log("[UI] 🧪 Testing data transmission...");
            const testPayload = { type: "test", message: "Frontend is listening" };
            await room.localParticipant?.publishData(
              new TextEncoder().encode(JSON.stringify(testPayload)),
              { topic: "test" }
            );
            console.log("[UI] 🧪 Test data sent successfully");
          }
        } catch (e) {
          console.error("[UI] 🧪 Test data failed:", e);
        }
      }, 3000);

      return () => {
        room.off(RoomEvent.DataReceived, handler);
        room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        console.log("[UI] 🔌 All event listeners detached from room:", room.name);
      };
    }, [room, connectionState]); // Added connectionState to dependencies

    return null;
  }

  // ---- main UI return (belongs to AICallInterface) ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Voice Assistant</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience seamless voice communication with our AI-powered assistant
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Voice Call Interface
                </CardTitle>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20" />
              </CardHeader>

              <CardContent className="space-y-6">

                {token ? (
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">


                    <LiveKitRoom serverUrl={wsUrl} token={token} connect>
                      <LiveKitDataBridge />
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
                ) : (
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
            {sharedProducts.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl shadow-lg border-2 border-green-200 dark:border-green-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Products Shared by AI</h3>
                  <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm font-medium">
                    {sharedProducts.length} product{sharedProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {sharedProducts.map((p, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-green-200 dark:border-green-700 p-4 mb-4 last:mb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 border-2 border-green-300 dark:border-green-600">
                        <img
                          src={p.img || p.url}
                          alt={p.itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("[UI] Image failed to load for:", p.itemName);
                            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                          }}
                          onLoad={() => console.log("[UI] Image loaded successfully for:", p.itemName)}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">{p.itemName}</h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">{p.description}</p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-green-600 dark:text-green-400 font-bold text-lg">{p.price}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Color: {p.color}</span>
                          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Material: {p.material}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => window.open(p.url, "_blank")}
                          >
                            View Product
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log("[UI] Product details:", p);
                              toast({
                                title: "Product Info",
                                description: `${p.itemName} - ${p.description} (${p.price})`
                              });
                            }}
                          >
                            Info
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICallInterface;
