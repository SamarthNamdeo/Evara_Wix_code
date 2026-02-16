import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your wedding planning AI assistant. I can help you with theme ideas, vendor recommendations, timeline planning, budget suggestions, and much more. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What are some popular wedding themes for spring?",
    "How should I plan my wedding timeline?",
    "What vendors do I need to book first?",
    "Help me create a wedding budget",
    "What are some unique wedding ideas?",
    "How do I choose a wedding venue?"
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('theme') || lowerMessage.includes('style')) {
      return "Here are some beautiful wedding themes to consider:\n\n• Rustic Elegance - Natural wood, greenery, and soft lighting\n• Modern Minimalist - Clean lines, neutral colors, and simple decor\n• Garden Romance - Floral arrangements, outdoor settings, and pastel colors\n• Vintage Charm - Antique details, lace, and classic elements\n• Bohemian Chic - Relaxed vibe, mixed textures, and earthy tones\n\nWould you like more details about any of these themes?";
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('schedule')) {
      return "Here's a recommended wedding planning timeline:\n\n12+ months before:\n• Set budget and guest list\n• Book venue and major vendors\n• Choose wedding party\n\n6-9 months before:\n• Order invitations\n• Book florist and photographer\n• Choose attire\n\n3-6 months before:\n• Send invitations\n• Plan ceremony details\n• Book transportation\n\n1-3 months before:\n• Final vendor meetings\n• Create seating chart\n• Confirm all details\n\nWould you like help with any specific part of the timeline?";
    }
    
    if (lowerMessage.includes('vendor') || lowerMessage.includes('book')) {
      return "Priority vendors to book first:\n\n1. Venue - Books up fastest, determines date\n2. Photographer/Videographer - High demand for quality professionals\n3. Caterer - Essential for guest experience\n4. Band/DJ - Popular dates fill quickly\n5. Florist - Especially for peak seasons\n6. Hair & Makeup - For you and wedding party\n\nTip: Check out your Vendor Directory page to organize your vendor contacts! Would you like recommendations for any specific vendor type?";
    }
    
    if (lowerMessage.includes('budget')) {
      return "Here's a typical wedding budget breakdown:\n\n• Venue & Catering: 40-50%\n• Photography/Video: 10-15%\n• Flowers & Decor: 8-10%\n• Entertainment: 8-10%\n• Attire: 8-10%\n• Invitations: 2-3%\n• Miscellaneous: 5-10%\n\nTips for staying on budget:\n• Prioritize what matters most to you\n• Consider off-peak dates\n• DIY where possible\n• Track expenses in your checklist\n\nWhat's your approximate budget range?";
    }
    
    if (lowerMessage.includes('venue') || lowerMessage.includes('location')) {
      return "Choosing the perfect venue:\n\nConsider these factors:\n• Guest capacity\n• Location accessibility\n• Indoor/outdoor options\n• Available dates\n• Included amenities\n• Backup plans for weather\n\nVenue types:\n• Ballrooms - Classic, climate-controlled\n• Gardens - Natural beauty, seasonal\n• Barns - Rustic charm, flexible\n• Beaches - Romantic, weather-dependent\n• Historic sites - Unique character\n\nWhat type of atmosphere are you envisioning?";
    }
    
    if (lowerMessage.includes('unique') || lowerMessage.includes('creative') || lowerMessage.includes('different')) {
      return "Unique wedding ideas to make your day special:\n\n• Interactive food stations or food trucks\n• Signature cocktails named after your love story\n• Live painting of your ceremony\n• Surprise entertainment (flash mob, fireworks)\n• Personalized guest favors\n• Photo booth with custom props\n• Lawn games for outdoor receptions\n• Late-night snack bar\n• Custom wedding hashtag and social media wall\n\nWhat aspect of your wedding would you like to make more unique?";
    }
    
    if (lowerMessage.includes('guest') || lowerMessage.includes('rsvp')) {
      return "Managing your guest list effectively:\n\n• Start with your must-have guests\n• Consider venue capacity\n• Track RSVPs in your Guest List page\n• Note dietary restrictions\n• Plan for plus-ones\n• Send save-the-dates 6-8 months ahead\n• Send invitations 6-8 weeks before\n• Follow up with non-responders\n\nDon't forget to use the Guest List feature in Evara to track all this information! Need help with guest list etiquette?";
    }
    
    return "That's a great question! I can help you with:\n\n• Wedding themes and styles\n• Planning timelines\n• Vendor recommendations\n• Budget planning\n• Venue selection\n• Guest list management\n• Unique ideas and inspiration\n\nCould you tell me more about what you're looking for? Or try one of the suggested questions below!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-16 flex flex-col">
        <div className="mb-8">
          <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4">
            AI Wedding Assistant
          </h1>
          <p className="font-paragraph text-lg text-primary/80">
            Get personalized suggestions and expert advice for your wedding planning
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white p-6 md:p-8 mb-6 overflow-y-auto max-h-[600px]">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-primary'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={16} className="text-primary" />
                      <span className="font-heading text-sm">AI Assistant</span>
                    </div>
                  )}
                  <p className="font-paragraph text-base whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-secondary text-primary p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span className="font-paragraph text-base">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <p className="font-paragraph text-sm text-primary/70 mb-3">Suggested questions:</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-4 bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 font-paragraph text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about wedding planning..."
            className="flex-1 px-6 py-4 bg-white border-2 border-buttonborder text-primary font-paragraph text-base focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-8 py-4 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={20} />
            Send
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
