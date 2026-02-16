// HPI 1.7-V
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { CheckSquare, Users, Briefcase, Calendar, MessageSquare, ArrowRight, Star, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Types ---
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  color: string;
}

// --- Components ---

const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={1600}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const SectionHeading = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <h2 className={`font-heading text-4xl md:text-5xl lg:text-6xl text-primary mb-6 ${className}`}>
      {children}
    </h2>
  );
};

const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
};

export default function HomePage() {
  // --- Canonical Data Sources ---
  const features: Feature[] = [
    {
      icon: CheckSquare,
      title: 'Wedding Checklist',
      description: 'Track every task and milestone leading up to your special day',
      link: '/checklist',
      color: 'bg-secondary'
    },
    {
      icon: Users,
      title: 'Guest Management',
      description: 'Organize your guest list with RSVP tracking and dietary preferences',
      link: '/guests',
      color: 'bg-background'
    },
    {
      icon: Briefcase,
      title: 'Vendor Directory',
      description: 'Connect with trusted wedding vendors and service providers',
      link: '/vendors',
      color: 'bg-secondary'
    },
    {
      icon: Calendar,
      title: 'Event Calendar',
      description: 'Schedule and manage all your wedding-related events in one place',
      link: '/calendar',
      color: 'bg-background'
    }
  ];

  // --- Scroll Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-primary selection:bg-secondary selection:text-primary overflow-x-clip">
      <Header />

      {/* --- HERO SECTION: Split Vertical Layout (Inspiration Image Replication) --- */}
      <section className="relative w-full flex flex-col">
        {/* Top: Typography & Brand */}
        <div className="w-full min-h-[45vh] md:min-h-[50vh] bg-background flex flex-col justify-center items-center px-6 py-20 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="font-heading text-[15vw] md:text-[12vw] lg:text-[10rem] leading-[0.8] tracking-tight text-primary">
              EVARA
            </h1>
            <div className="w-24 h-[1px] bg-primary/30 mx-auto my-8" />
            <p className="font-paragraph text-xl md:text-2xl lg:text-3xl text-primary/80 tracking-wide font-light">
              Artisanal Planning for Your Perfect Union
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
               <Link to="/checklist" className="group relative overflow-hidden px-8 py-3 rounded-full border border-primary text-primary hover:text-background transition-colors duration-500">
                  <span className="relative z-10 font-paragraph text-lg">Begin Your Journey</span>
                  <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
               </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Immersive Image */}
        <div className="w-full h-[60vh] md:h-[75vh] relative overflow-hidden">
           <ParallaxImage 
             src="https://static.wixstatic.com/media/8c86f3_aec2bbe3e2ff4bdf86021ce5369fb1ff~mv2.png?originWidth=1600&originHeight=896"
             alt="Elegant table setting with pears and natural light"
             className="w-full h-full"
           />
           {/* Decorative Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION: Editorial Layout --- */}
      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 lg:px-24 py-32 md:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-4 sticky top-32">
            <span className="block font-paragraph text-sm tracking-[0.2em] uppercase text-primary/60 mb-4">
              The Philosophy
            </span>
            <h2 className="font-heading text-4xl md:text-5xl text-primary leading-tight">
              Curating <br/> Memories, <br/> <span className="italic text-primary/70">Effortlessly.</span>
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-8">
            <p className="font-paragraph text-2xl md:text-3xl leading-relaxed text-primary font-light">
              <span className="text-6xl float-left mr-4 mt-[-10px] font-heading">W</span>
              e believe that planning a wedding should be as beautiful as the event itself. Evara brings together the timeless art of celebration with modern precision.
            </p>
            <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-primary/10">
              <div>
                <h3 className="font-heading text-xl mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Intention
                </h3>
                <p className="font-paragraph text-primary/70 leading-relaxed">
                  Every tool is designed to help you focus on what matters most—the love you share and the people you cherish.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-xl mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Precision
                </h3>
                <p className="font-paragraph text-primary/70 leading-relaxed">
                  From vendor contracts to dietary restrictions, we handle the complexity so you can enjoy the journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION: Zig-Zag Parallax Grid --- */}
      <section className="w-full bg-secondary/20 py-32 overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-24">
             <SectionHeading>The Collection</SectionHeading>
             <p className="font-paragraph text-lg text-primary/70 max-w-2xl mx-auto">
               A suite of refined tools designed to orchestrate every detail of your celebration.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`${index % 2 === 1 ? 'md:mt-24' : ''}`}
              >
                <Link to={feature.link} className="block group h-full">
                  <div className={`relative h-full p-10 md:p-14 transition-all duration-500 border border-primary/10 hover:border-primary/30 bg-background hover:shadow-xl overflow-hidden`}>
                    {/* Hover Background Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.color === 'bg-secondary' ? 'bg-primary' : 'bg-secondary'}`} />
                    
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[300px]">
                      <div className="mb-8">
                        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                          <feature.icon className="w-8 h-8 text-primary" strokeWidth={1.2} />
                        </div>
                        <h3 className="font-heading text-3xl text-primary mb-4 group-hover:translate-x-2 transition-transform duration-300">
                          {feature.title}
                        </h3>
                        <p className="font-paragraph text-lg text-primary/70 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-primary font-paragraph text-sm uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER: Full Bleed --- */}
      <section className="w-full h-[80vh] relative overflow-hidden flex items-center justify-center">
        <ParallaxImage 
          src="https://static.wixstatic.com/media/8c86f3_eed280e81fbf4e1a9dbc7fe2c2bec354~mv2.png?originWidth=1920&originHeight=1280"
          alt="Wedding atmosphere"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="relative z-10 text-center px-6">
          <h2 className="font-heading text-5xl md:text-7xl text-primary-foreground drop-shadow-lg">
            "Simplicity is the <br/> ultimate sophistication."
          </h2>
        </div>
      </section>

      {/* --- AI ASSISTANT: Dark Mode Feature --- */}
      <section className="w-full bg-primary text-primary-foreground py-32 relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-sm border border-white/10">
                 <Image
                   src="https://static.wixstatic.com/media/8c86f3_c20395cb76f94051b9056b75e7f672e0~mv2.png?originWidth=960&originHeight=704"
                   alt="AI Assistant Interface Concept"
                   width={1000}
                   className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                 />
                 <div className="absolute bottom-8 left-8 right-8 bg-background/10 backdrop-blur-md p-6 border border-white/10 rounded">
                    <div className="flex items-start gap-4">
                      <MessageSquare className="w-6 h-6 text-secondary mt-1" />
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Evara AI</p>
                        <p className="font-heading text-lg text-white">"I found 3 florists in Tuscany that match your 'Rustic Chic' moodboard."</p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 text-secondary text-sm font-paragraph tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Now Available
              </div>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-secondary leading-none">
                Your Digital <br/> Concierge
              </h2>
              <p className="font-paragraph text-xl text-primary-foreground/80 leading-relaxed max-w-xl">
                Meet your personal wedding consultant. Powered by advanced AI, it suggests vendors, drafts timelines, and offers creative inspiration tailored specifically to your taste.
              </p>
              <div className="pt-8">
                <Link to="/ai-assistant">
                  <button className="group flex items-center gap-4 text-2xl font-heading text-secondary hover:text-white transition-colors">
                    Start a Conversation
                    <span className="block w-12 h-[1px] bg-secondary group-hover:w-20 transition-all duration-300" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="w-full bg-background py-32 md:py-48 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="font-heading text-5xl md:text-7xl text-primary">
            Ready to Begin?
          </h2>
          <p className="font-paragraph text-xl text-primary/70">
            Your perfect day deserves the perfect plan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/checklist">
              <button className="px-12 py-5 bg-primary text-primary-foreground font-paragraph text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                Create Free Account
              </button>
            </Link>
            <Link to="/vendors">
              <button className="px-12 py-5 border border-primary text-primary font-paragraph text-lg hover:bg-secondary/20 transition-all duration-300">
                Browse Vendors
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}