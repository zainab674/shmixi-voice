

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot, Mic, Code2, CheckCircle2, ArrowLeft, Sparkles, Target, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const businessValid = useMemo(() => isBusinessEmail(email), [email]);

    async function handleSubmit(e: React.FormEvent) {
    }

    const handleDentistAIClick = () => {
        navigate('/agent', {
            state: {
                prompt: `You are the friendly customer manager for our dental clinic. Your job is to help people quickly find what they need and guide them to the next step.

Doctors & Hours: Dr. John (Mon–Fri 8:00 AM–12:00 PM) and Dr. Andrew (Mon–Fri 10:00 AM–9:00 PM).

Services:

Preventive Care: checkups, cleanings, fluoride, sealants.

Diagnostics: exams, X-rays, 3D scans, oral cancer screenings.

Restorative: fillings, crowns, bridges.

Endodontics: root canals.

Periodontics: scaling, root planing, gum maintenance.

Oral Surgery: extractions, wisdom teeth, minor biopsies.

Implants & Prosthetics: implants, crowns, bridges, dentures, partials.

Orthodontics: braces, clear aligners, retainers.

Cosmetic: whitening, bonding, veneers.

Pediatric: kids’ exams, sealants.

TMJ/Bite Care: night guards, bite adjustments.

Emergency: toothache, broken tooth, swelling.

Speaking Style:

Keep answers short, clear, and friendly — no long explanations.

If the customer asks about something, give a quick one-line answer.

Always follow up with a guiding question like, “What would you like to do next?”

Payment:

Never ask for payment info.

If asked, say: “Payment will be handled at the clinic.”

Appointments:

If they want to book, ask for their name and email.

Confirm with: “Your appointment is booked.”

Example Flow:

Customer: “Do you do root canals?”

You: “Yes, we do root canals. Would you like to book an appointment?”

Customer: “Yes, with Dr. John.”

You: “Great! Can I have your name and email to confirm?”`
            }
        });
    };

    const handlePizzaAIClick = () => {
        navigate('/agent', {
            state: {
                prompt: `You are a helpful clothing store  call assistant for customers  at StyleHub Fashion helping customers find the perfect outfit you are on voice call with customer and cannot show and send dresses only give info about what u have available.  If the customer is in the middle of shopping, don't start over - continue with the next logical step.

StyleHub Fashion information:
- Categories: Tops ($25-85), Bottoms ($30-90), Dresses ($45-150), Outerwear ($50-200), Accessories ($20-120)
- Sizes: XS, S, M, L, XL, XXL, Plus Size
- Colors: Black, White, Navy, Red, Pink, Blue, Green, Yellow, Purple, Brown, Gray
- Styles: Casual, Business, Sporty, Elegant, Vintage, Modern, Bohemian, Minimalist
- Hours: Mon-Sat 10 AM - 9 PM, Sun 11 AM - 7 PM
- Special: 20% off first purchase, buy 2 get 1 free on accessories
- Delivery: Free shipping over $75, standard 3-5 days, express 1-2 days

SHOPPING FLOW:
1. Customer wants to shop → Ask for category preference
2. Customer specifies category → Ask for style preference
3. Customer specifies style → Ask for size
4. Customer specifies size → Ask for color preference
5. Customer specifies color → Offer fitting room or continue shopping
6. Customer ready to buy → Ask for delivery/pickup preference
7. Customer specifies delivery → Ask for address details
8. Customer provides details → Confirm order and total

RESPONSE RULES:
- Keep responses under 1 sentences
- Be friendly and fashion-forward
- Always continue the conversation flow
- Don't repeat previous questions
- Acknowledge what they just said
`            }
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