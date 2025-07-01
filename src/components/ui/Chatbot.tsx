'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, Mic, SendHorizontal, User, Volume2, LoaderCircle, MessageSquarePlus } from 'lucide-react';

interface FormValues {
  input: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>();
  const inputValue = watch("input");

  const { toast } = useToast();
  const { speak, isSpeaking } = useSpeechSynthesis();
  const { isListening, startListening, stopListening, supported: speechRecognitionSupported } = useSpeechRecognition((transcript) => {
    setValue("input", transcript);
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserMessage: SubmitHandler<FormValues> = async (data) => {
    const userInput = data.input.trim();
    if (!userInput) return;

    const newUserMessage: Message = { id: Date.now().toString(), role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    reset();

    const response = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ query: userInput }),
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (response.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
      setMessages(prev => prev.slice(0, -1));
    } else if (response.answer) {
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    }

    setIsLoading(false);
  };

  const handleToggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[480px] bg-white shadow-xl rounded-lg flex flex-col">
          <div className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5" />
              InternBot
            </span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
              ✕
            </button>
          </div>

          <div ref={scrollAreaRef} className="flex-1 px-3 py-2 overflow-y-auto">
            <div className="space-y-4 text-sm text-gray-700">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex items-start gap-2", message.role === "user" && "justify-end")}
                >
                  {message.role === "assistant" && (
                    <AvatarIcon><Bot className="w-4 h-4" /></AvatarIcon>
                  )}
                  <div className={cn(
                    "rounded-lg px-3 py-2 max-w-[80%] break-words",
                    message.role === "assistant"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-purple-600 text-white"
                  )}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && (
                      <button
                        className="mt-1 text-purple-600 hover:text-purple-800"
                        onClick={() => speak(message.content)}
                        disabled={isSpeaking}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {message.role === "user" && (
                    <AvatarIcon><User className="w-4 h-4" /></AvatarIcon>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <AvatarIcon><Bot className="w-4 h-4" /></AvatarIcon>
                  <div className="rounded-lg px-3 py-2 bg-gray-100">
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit(handleUserMessage)}
            className="flex border-t p-2 gap-2"
          >
            <input
              {...register("input")}
              type="text"
              placeholder={isListening ? "Listening..." : "Ask a question..."}
              disabled={isLoading}
              className="flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none"
            />
            {speechRecognitionSupported && (
              <button
                type="button"
                onClick={handleToggleListening}
                className={`rounded-md px-2 ${isListening ? 'bg-red-500' : 'bg-gray-200'}`}
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
        >
          💬
        </button>
      )}
    </div>
  );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
    {children}
  </div>
);
