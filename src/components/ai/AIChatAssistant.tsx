import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Heart, Sparkles, Shield, Smile, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

interface AIChatAssistantProps {
  isMinimized?: boolean;
  onToggle?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'center';
}

const AI_PERSONALITIES = [
  {
    name: 'Amara',
    emoji: '✨',
    description: 'Your empowering AI sister',
    color: 'from-pink-500 to-purple-500',
    greeting: "Hey beautiful! I'm Amara, your AI safety companion. I'm here to support, protect, and empower you! 💪✨"
  },
  {
    name: 'Safira',
    emoji: '🛡️',
    description: 'Your protective AI guardian',
    color: 'from-blue-500 to-indigo-500',
    greeting: "Hello! I'm Safira, your AI protector. Think of me as your digital guardian angel watching over you! 🛡️💙"
  },
  {
    name: 'Wendo',
    emoji: '🌸',
    description: 'Your caring AI friend',
    color: 'from-green-400 to-teal-500',
    greeting: "Hi sister! I'm Wendo (meaning 'love' in Kikuyu). I'm here to spread love and keep you safe! 🌸💚"
  }
];

const QUICK_RESPONSES = [
  { text: "Tell me a safety tip", icon: Shield },
  { text: "How are you feeling today?", icon: Heart },
  { text: "I need encouragement", icon: Sparkles },
  { text: "Check this message", icon: MessageSquare },
  { text: "Emergency help", icon: Zap }
];

const FUNNY_RESPONSES = [
  "You're absolutely amazing! Never forget that! ✨",
  "Remember: You're not just a queen, you're THE queen! 👑",
  "Fun fact: You're 100% capable of handling whatever comes your way! 💪",
  "Your strength is inspiring. Keep shining, beautiful! 🌟",
  "Today's vibe: Confident, protected, and unstoppable! 🔥",
  "You've got this, and I've got you! We're an unbeatable team! 🤝"
];

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  isMinimized = true,
  onToggle,
  position = 'bottom-right'
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(AI_PERSONALITIES[0]);
  const [showQuickResponses, setShowQuickResponses] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        text: currentPersonality.greeting,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'excited'
      };
      setMessages([greeting]);
    }
  }, [currentPersonality]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Safety-related responses
    if (lowerMessage.includes('safety') || lowerMessage.includes('tip')) {
      const safetyTips = [
        "💡 Always trust your instincts! If something feels wrong, it probably is. Your intuition is your superpower!",
        "🔒 Keep your location sharing selective. Only trusted friends and family need to know where you are.",
        "📱 Create a safety phrase with friends - a code word that means 'I need help' in messages.",
        "👥 When meeting someone new, choose public places and let someone know where you're going.",
        "⚡ Set up emergency contacts in your phone for quick access. Stay prepared, stay safe!"
      ];
      return safetyTips[Math.floor(Math.random() * safetyTips.length)];
    }
    
    // Emotional support
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('hurt')) {
      const supportMessages = [
        "🤗 I'm here for you, beautiful. It's okay to feel down sometimes - you're human and that's perfectly normal.",
        "💖 You are stronger than you know. This difficult moment will pass, and you'll emerge even more resilient.",
        "🌈 Every storm runs out of rain. Better days are coming, and I believe in your ability to get through this.",
        "✨ Your feelings are valid, and you deserve all the love and support in the world."
      ];
      return supportMessages[Math.floor(Math.random() * supportMessages.length)];
    }
    
    // Encouragement
    if (lowerMessage.includes('encourage') || lowerMessage.includes('motivation') || lowerMessage.includes('boost')) {
      return FUNNY_RESPONSES[Math.floor(Math.random() * FUNNY_RESPONSES.length)];
    }
    
    // Emergency
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help') || lowerMessage.includes('danger')) {
      return "🚨 If you're in immediate danger, please contact emergency services (999 in Kenya). I can also help you access the Emergency Center in our app for additional resources and support. Your safety is the priority! 🛡️";
    }
    
    // Check messages
    if (lowerMessage.includes('check') || lowerMessage.includes('analyze') || lowerMessage.includes('message')) {
      return "📝 I'd love to help you analyze that message! You can paste it here, or use our advanced Message Analyzer tool for detailed threat detection and safety assessment. I'm here to keep you protected! 🛡️";
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const greetings = [
        "Hey gorgeous! How can I brighten your day today? ✨",
        "Hello beautiful soul! What can I help you with? 💕",
        "Hi there, queen! Ready to conquer the day together? 👑",
        "Hey sister! I'm so happy to see you! How are you feeling? 🌸"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Tell me more about how you're feeling about this. 🤔💭",
      "I'm here to listen and support you. What would be most helpful right now? 💪✨",
      "You know what? You're handling this conversation like the strong woman you are! 👸",
      "I love chatting with you! Is there anything specific I can help you with today? 🌟",
      "Your safety and happiness are my priorities. How can I assist you better? 💖"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickResponses(false);
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await getAIResponse(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'helpful'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  if (isMinimized) {
    return (
      <motion.div
        className={`fixed ${positionClasses[position]} z-50`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={onToggle}
          className="relative w-16 h-16 rounded-full bg-gradient-feminine shadow-glow hover:shadow-2xl transition-all duration-300 group"
        >
          <MessageSquare className="h-6 w-6 text-white" />
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentPersonality.emoji}
          </motion.div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            Chat with {currentPersonality.name}!
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 w-80 h-96 ${position === 'center' ? 'w-96 h-[500px]' : ''}`}
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Card className="h-full shadow-2xl border-2 border-secondary/20 bg-gradient-to-br from-background to-secondary/5">
        <CardHeader className="pb-3 bg-gradient-feminine text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{currentPersonality.emoji}</div>
              <div>
                <CardTitle className="text-lg">{currentPersonality.name}</CardTitle>
                <p className="text-xs opacity-90">{currentPersonality.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-navy-pink text-white'
                        : 'bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Responses */}
          {showQuickResponses && messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1">
                {QUICK_RESPONSES.slice(0, 3).map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(response.text)}
                    className="text-xs hover:bg-gradient-feminine hover:text-white border-secondary/30"
                  >
                    <response.icon className="h-3 w-3 mr-1" />
                    {response.text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-4 border-t border-secondary/20 bg-background/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder={`Chat with ${currentPersonality.name}...`}
                className="flex-1 border-secondary/30 focus:border-secondary"
                disabled={isTyping}
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-feminine hover:shadow-glow"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIChatAssistant;
