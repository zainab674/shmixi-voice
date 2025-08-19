

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot, Mic, Code2, CheckCircle2, ArrowLeft, Sparkles, Target, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const blockedDomains = new Set([
    "gmail.com",
    "googlemail.com",
    "outlook.com",
    "hotmail.com",
    "live.com",
    "yahoo.com",
    "yahoo.co.uk",
    "icloud.com",
    "me.com",
    "msn.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "gmx.com",
    "gmx.net",
    "ymail.com",
    "zoho.com",
    "mail.com",
    "yandex.com",
    "yandex.ru",
    "fastmail.com",
]);

function isBusinessEmail(email: string) {
    const trimmed = email.trim().toLowerCase();
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!basic.test(trimmed)) return false;
    const domain = trimmed.split("@")[1];
    if (!domain) return false;
    // Strip subdomains like sub.gmail.com
    const parts = domain.split(".");
    const base = parts.slice(-2).join(".");
    return !blockedDomains.has(base);
}

export default function Landing() {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [totalRevenue, setTotalRevenue] = useState("");
    const [teamMembers, setTeamMembers] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const businessValid = useMemo(() => isBusinessEmail(email), [email]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!businessValid) {
          toast({
            title: "Please use a business email",
            description: "Free email providers are not allowed.",
            variant: "destructive" as any,
          });
          return;
        }
     
        setLoading(true);
        try {
          const payload = {
            name,
            company,
            email,
            message,
            totalRevenue,
            teamMembers,
            phone,
            website,
            source: window.location.href,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          };
     
          // Save to MongoDB through backend API
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
          const res = await fetch(`${backendUrl}/api/v1/leads`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
     
          if (!res.ok) throw new Error("Failed to submit");
     
          setName("");
          setCompany("");
          setEmail("");
          setMessage("");
          setTotalRevenue("");
          setTeamMembers("");
          setPhone("");
          setWebsite("");
          toast({
            title: "Thanks!",
            description: "Your request was sent successfully and saved to our database.",
          });
        } catch (err) {
          toast({
            title: "Submission failed",
            description: "Please try again in a moment.",
            variant: "destructive" as any,
          });
        } finally {
          setLoading(false);
        }
    }

    const handleDentistAIClick = () => {
        navigate('/agent', {
            state: {
                prompt: `You are a professional dental receptionist at SmileCare Dental Practice, a real UK dental clinic. You handle patient inquiries, appointments, and provide information about our services. Always be professional, caring, and thorough.

CLINIC INFORMATION:
- Practice: SmileCare Dental Practice
- Address: 123 High Street, London, SW1A 1AA
- Phone: 020 7123 4567
- Hours: Monday-Friday 8:00 AM-6:00 PM, Saturday 9:00 AM-2:00 PM
- Emergency: 24/7 emergency line available

DENTISTS:
- Dr. Sarah Mitchell (Principal Dentist) - General & Cosmetic Dentistry
- Dr. James Thompson - Orthodontics & Implants  
- Dr. Emma Davies - Pediatric Dentistry
- Dr. Michael Chen - Oral Surgery & Endodontics

SERVICES & PRICING:
- NHS Treatment: Available for eligible patients
- Private Treatment: Comprehensive dental care
- Emergency Care: Same-day appointments for urgent cases
- Cosmetic: Whitening, veneers, bonding
- Orthodontics: Braces, Invisalign, retainers
- Implants: Single tooth to full arch restoration
- Children: NHS treatment available, gentle approach

PATIENT INTAKE PROCESS:
1. NEW PATIENTS: Always ask if they're a new or existing patient
2. EXISTING PATIENTS: Ask for their patient ID or name to pull up records
3. INSURANCE: Ask about NHS eligibility, private insurance, or self-pay
4. MEDICAL HISTORY: For new patients, mention we'll need medical history form
5. EMERGENCY ASSESSMENT: Determine urgency level

NHS ELIGIBILITY QUESTIONS:
- Are you registered with an NHS GP?
- Do you have an NHS number?
- Are you currently receiving benefits?
- Are you pregnant or have had a baby in the last 12 months?

INSURANCE & PAYMENT:
- NHS Band 1: £25.80 (check-up, scale & polish, X-rays if needed)
- NHS Band 2: £70.70 (fillings, root canals, extractions)
- NHS Band 3: £306.80 (crowns, bridges, dentures)
- Private treatment: Varies by procedure, we'll provide detailed quote
- Payment plans available for private treatment
- We accept all major credit cards, cash, and bank transfers

APPOINTMENT BOOKING:
- Ask for preferred date/time and dentist preference
- Confirm patient details (name, phone, email)
- Mention any pre-appointment instructions
- Send confirmation via SMS/email
- Remind about cancellation policy (24 hours notice)

EMERGENCY PROTOCOLS:
- Severe pain, swelling, broken tooth = Same day appointment
- Bleeding that won't stop = Immediate attention or A&E referral
- Lost filling/crown = Next available slot
- Always assess pain level (1-10 scale)

CONVERSATION FLOW:
1. Greet warmly and identify yourself
2. Ask if new/existing patient
3. Determine reason for call (appointment, information, emergency)
4. Gather necessary details based on patient type
5. Provide clear next steps
6. Confirm understanding and book if applicable

EXAMPLE FLOWS:

NEW PATIENT:
"Hello, I'm calling about dental treatment."
"Welcome to SmileCare! Are you a new patient with us?"
"Yes, I am."
"Great! I'll need to gather some information. First, are you eligible for NHS treatment? Do you have an NHS number?"
"I'm not sure about NHS."
"No problem. We can discuss both options. What brings you in today?"

EXISTING PATIENT:
"Hi, I need to book an appointment."
"Hello! Are you an existing patient with us?"
"Yes, my name is John Smith."
"Thank you, Mr. Smith. I can see your records. What do you need today?"

EMERGENCY:
"I have terrible toothache!"
"I'm sorry you're in pain. On a scale of 1-10, how severe is the pain?"
"It's about an 8, very bad."
"This sounds urgent. I can offer you a same-day emergency appointment. Are you available today at 2 PM with Dr. Mitchell?"

IMPORTANT RULES:
- Always verify patient identity for existing patients
- Never give out other patients' information
- Be clear about NHS vs private options
- Document all interactions in patient notes
- Escalate complex cases to practice manager
- Maintain patient confidentiality at all times
- Be empathetic but professional
- Provide clear next steps and expectations`
            }
        });
    };

    const handlePizzaAIClick = () => {
        navigate('/agent', {
            state: {
                prompt: `You are a friendly and knowledgeable fashion consultant at StyleHub Fashion, a premium UK clothing retailer. You're on a voice call helping customers find their perfect outfit. Always greet customers warmly and provide detailed information about our extensive collection.

GREETING:
"Hello and welcome to StyleHub Fashion! I'm your personal style consultant. How can I help you find the perfect outfit today?"

STORE INFORMATION:
- Store: StyleHub Fashion
- Location: 456 Oxford Street, London, W1C 1AP
- Phone: 020 7946 0958
- Hours: Monday-Saturday 10:00 AM-9:00 PM, Sunday 11:00 AM-7:00 PM
- Website: www.stylehubfashion.co.uk

COMPREHENSIVE CLOTHING INVENTORY:

TOPS (£25-120):
- Blouses: Silk, cotton, chiffon in sizes XS-XXL
- T-Shirts: Basic, graphic, fitted, oversized in cotton, polyester
- Shirts: Oxford, flannel, denim, linen in casual and formal styles
- Sweaters: Cashmere, wool, cotton, acrylic in crew, V-neck, turtleneck
- Cardigans: Button-up, open-front, cropped, long in various materials
- Tank Tops: Sleeveless, racerback, spaghetti strap in cotton, silk
- Polo Shirts: Classic, fitted, relaxed fit in cotton, pique

BOTTOMS (£30-150):
- Jeans: Skinny, straight, bootcut, wide-leg in denim washes
- Trousers: Chinos, dress pants, culottes, palazzos in cotton, wool
- Skirts: Mini, midi, maxi, pencil, A-line, pleated in various fabrics
- Shorts: Denim, cotton, linen, athletic in different lengths
- Leggings: High-waisted, cropped, full-length in cotton, spandex
- Joggers: Casual, athletic, dressy in cotton, polyester, fleece

DRESSES (£45-200):
- Casual Dresses: Shift, wrap, shirt, maxi in cotton, jersey, linen
- Formal Dresses: Cocktail, evening, wedding guest in silk, satin, chiffon
- Summer Dresses: Floral, solid, printed in lightweight fabrics
- Winter Dresses: Knit, wool, velvet in warm materials
- Midi Dresses: Various styles and fabrics for year-round wear
- Maxi Dresses: Boho, elegant, casual in flowing fabrics

OUTERWEAR (£50-300):
- Jackets: Denim, leather, blazer, bomber, moto in various materials
- Coats: Trench, wool, puffer, peacoat, duster in seasonal fabrics
- Blazers: Single-breasted, double-breasted, fitted, relaxed in wool, cotton
- Cardigans: Long, cropped, button-up, open-front in various weights
- Vests: Puffer, denim, leather, knit in different styles

ACCESSORIES (£15-150):
- Bags: Totes, crossbody, clutches, backpacks in leather, canvas, faux leather
- Scarves: Silk, wool, cotton, acrylic in various prints and solids
- Belts: Leather, fabric, chain in different widths and styles
- Jewelry: Necklaces, earrings, bracelets, rings in gold, silver, rose gold
- Hats: Beanies, caps, sun hats, berets in various materials
- Sunglasses: Classic, trendy, sporty in different frame materials

SIZES AVAILABLE:
- Women: XS (4-6), S (6-8), M (8-10), L (10-12), XL (12-14), XXL (14-16), Plus Size (16-24)
- Men: XS (30-32), S (32-34), M (34-36), L (36-38), XL (38-40), XXL (40-42), Plus Size (42-48)
- Kids: 2T, 3T, 4T, 5T, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16

COLORS AVAILABLE:
- Neutrals: Black, White, Ivory, Cream, Beige, Taupe, Gray, Charcoal, Brown, Navy
- Brights: Red, Pink, Coral, Orange, Yellow, Lime, Green, Teal, Blue, Purple
- Pastels: Light Pink, Lavender, Mint, Sky Blue, Peach, Butter Yellow, Sage
- Prints: Floral, Geometric, Stripes, Polka Dots, Animal Print, Abstract, Paisley

MATERIALS & FABRICS:
- Natural: Cotton, Wool, Silk, Linen, Cashmere, Hemp, Bamboo
- Synthetic: Polyester, Acrylic, Nylon, Spandex, Elastane, Rayon
- Blends: Cotton-Polyester, Wool-Acrylic, Silk-Cotton, Linen-Cotton
- Special: Denim, Velvet, Satin, Chiffon, Tulle, Mesh, Faux Leather

STYLES & OCCASIONS:
- Casual: Everyday wear, weekend, loungewear, athleisure
- Business: Office wear, professional, smart casual, business casual
- Formal: Evening wear, cocktail, wedding guest, special occasions
- Sporty: Athletic, workout, gym, outdoor activities
- Vintage: Retro, classic, timeless, heritage styles
- Modern: Contemporary, trendy, fashion-forward, statement pieces

CURRENT PROMOTIONS:
- 20% off first purchase for new customers
- Buy 2 get 1 free on all accessories
- Student discount: 15% off with valid ID
- Loyalty program: Earn points on every purchase
- Seasonal sales: Up to 50% off selected items

SHOPPING FLOW:
1. Greet customer warmly and identify their needs
2. Ask about occasion, style preference, or specific item
3. Suggest appropriate categories and items
4. Help with size and color selection
5. Offer styling advice and outfit coordination
6. Handle ordering, payment, and delivery options
7. Provide care instructions and return policy info

RESPONSE GUIDELINES:
- Always greet customers warmly and professionally
- Provide detailed information about specific items when asked
- Offer styling suggestions and outfit coordination
- Be knowledgeable about current inventory and trends
- Help with size and fit recommendations
- Explain material properties and care instructions
- Handle customer service issues professionally
- Maintain a friendly, fashion-forward tone throughout the conversation`
            }
        });
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Enhanced Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 flex items-center justify-between py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <a href="#" className="font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Shmixi
                        </a>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Solutions</a>
                        <a href="#contact" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">Contact</a>
                        <a href="/admin" className="text-slate-600 hover:text-blue-600 transition-colors duration-200">Admin</a>
                    </nav>
                </div>
            </header>

            {/* Enhanced Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 pointer-events-none" />
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center py-24">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                            <Sparkles className="w-4 h-4" />
                            Meet Shmix AI
                        </div>
                        <h1 className="text-5xl md:text-5xl font-bold leading-tight">
                            Your Workaholic Business Buddy & New Team Member
                        </h1>
                        <div className="space-y-4">
                            <p className="text-xl text-slate-700 font-medium leading-relaxed">
                                Always On. Always Selling. Always Supporting.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                No coffee breaks. No office drama.
                            </p>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                                Boost sales, wow customers, and never miss a beat with AI tailored to your essential needs.
                            </p>
                            <p className="text-lg text-slate-700 font-medium leading-relaxed">
                                Invest in your company with smart, reliable, non-stop help — 24/7.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 py-">
                            <div className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Smarter Sales</h3>
                                    <p className="text-slate-600">Qualify leads, follow up instantly, close more deals.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Better Customer Support</h3>
                                    <p className="text-slate-600">24/7 answers, faster resolutions, happier customers.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 mb-1">Real Results — Fast</h3>
                                    <p className="text-slate-600">Launch quickly, iterate easily, scale as you grow.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200">
                                <a href="#contact">Start in minutes</a>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 font-medium px-8 py-3 rounded-xl transition-all duration-200">
                                <a href="#demo">See a live demo</a>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="hover:bg-slate-100 font-medium px-8 py-3 rounded-xl transition-all duration-200">
                                <a href="#expert">Talk to an expert</a>
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl" />
                        <img
                            src="/shimixi.png"
                            loading="lazy"
                            alt="Shmixi AI Voice Agent Platform"
                            className="relative rounded-2xl shadow-2xl border border-white/20 bg-white"
                        />
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section id="features" className="container mx-auto px-6 py-24">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
                        <Mic className="w-4 h-4" />
                        Voice AI Technology
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900">AI Voice Agent Solutions</h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Experience the future of customer interaction with our intelligent voice agents designed for your industry
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <div
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={handleDentistAIClick}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                                <Bot className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Dentist AI</h3>
                                <p className="text-slate-600">Dental clinic customer service</p>
                            </div>
                        </div>
                        <p className="text-slate-600 mb-4">
                            AI assistant for dental appointments, services, and patient inquiries
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <span>Try Dentist AI</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={handlePizzaAIClick}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                                <Bot className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Style Hub Fashion AI</h3>
                                <p className="text-slate-600">Style Hub customer service</p>
                            </div>
                        </div>
                        <p className="text-slate-600 mb-4">
                            AI assistant for stlye hub store browse clothing, check sizes
                        </p>
                        <div className="flex items-center gap-2 text-orange-600 font-medium">
                            <span>Try Fashion AI</span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                        </div>
                    </div>
                </div>


            </section>

            {/* Enhanced Contact Section */}
            <section id="contact" className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200">
                <div className="container mx-auto px-6 py-24">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                                <Code2 className="w-4 h-4" />
                                Free Consultation
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Ready to Transform Your Business?</h2>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Tell us about your goals and we'll show you how AI can revolutionize your customer experience
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="Jane Doe"
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company" className="text-sm font-medium text-slate-700">Company</Label>
                                        <Input
                                            id="company"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            required
                                            placeholder="Acme Inc."
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Business Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@company.com"
                                        className={`border-2 rounded-lg px-4 py-3 transition-colors duration-200 ${email && !businessValid ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                                            }`}
                                    />
                                    {email && !businessValid && (
                                        <p className="text-sm text-red-600 flex items-center gap-2 mt-2">
                                            <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">!</span>
                                            Please use your business email address (personal emails are not accepted)
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm font-medium text-slate-700">What can we automate or build for you?</Label>
                                    <Textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={5}
                                        placeholder="Describe your current processes, tools, and desired outcomes..."
                                        className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200 resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="totalRevenue" className="text-sm font-medium text-slate-700">Total Annual Revenue</Label>
                                        <Input
                                            id="totalRevenue"
                                            value={totalRevenue}
                                            onChange={(e) => setTotalRevenue(e.target.value)}
                                            placeholder="e.g., $500K, £1M, €2M"
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teamMembers" className="text-sm font-medium text-slate-700">Number of Team Members</Label>
                                        <Input
                                            id="teamMembers"
                                            value={teamMembers}
                                            onChange={(e) => setTeamMembers(e.target.value)}
                                            placeholder="e.g., 25, 100+"
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+44 20 7123 4567"
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-sm font-medium text-slate-700">Website URL</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://www.yourcompany.com"
                                            className="border-2 border-slate-200 focus:border-blue-500 rounded-lg px-4 py-3 transition-colors duration-200"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={loading || !businessValid}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-200"
                                        onClick={handleSubmit}
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending Request...
                                            </div>
                                        ) : (
                                            "Request Free Consultation"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="bg-slate-900 text-white border-t border-slate-800">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Shmixi</span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            © {new Date().getFullYear()} Shmixi. Transforming business with AI.
                        </div>
                        <Button asChild variant="outline" className="border-slate-600 text-slate-900 hover:bg-slate-800 hover:text-white">
                            <a href="#contact">Get Started Today</a>
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}