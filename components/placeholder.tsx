"use client";


import { div } from "framer-motion/client";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import {useState, useEffect, useRef} from "react";
import React from "react";
import { Content } from "next/font/google";

export function PlaceholdersAndVanishInputDemo({chatHistory, setChatHistory, activeChatId, setActiveChatId, userName}: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);


  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

      useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, loading]);

    useEffect(() => {
        if (activeChatId) {
            const selected = chatHistory.find((c:any) => c.id === activeChatId);
            if (selected){
                setMessages(selected.messages);
            }
        } else {
            setMessages([]);
        }
    }, [activeChatId, chatHistory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    const userMessages = input.value;

    if(!userMessages.trim()) return;

    const newMessages = [...messages, {role: "user", content: userMessages}];
    setMessages(newMessages);
    input.value = "";
    setLoading(true);

    try {
        const res = await fetch("api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessages, userName: userName|| "User"}),
        });
        const data = await res.json();
        
// DI DALAM onSubmit placeholder.tsx
if (data.aiText) {
    const finalMessages = [...newMessages, { role: "assistant", content: data.aiText }];
    setMessages(finalMessages);

    let historyBaru; // 1. Siapkan wadahnya di luar IF/ELSE

    if (activeChatId) {
        // Jika sedang chat di riwayat lama, update isinya
        historyBaru = chatHistory.map((chat: any) =>
            chat.id === activeChatId ? { ...chat, messages: finalMessages } : chat
        );
    } else {
        // Jika ini chat baru, buat laci baru
        const idBaru = Date.now().toString();
        const sessionBaru = {
            id: idBaru,
            title: userMessages.substring(0, 25) + "...",
            messages: finalMessages,
        };
        historyBaru = [sessionBaru, ...chatHistory];
        setActiveChatId(idBaru); // 2. Kunci ID-nya supaya chat selanjutnya masuk ke 'Update'
    }

    // 3. Simpan hasil akhirnya (baik update maupun create)
    setChatHistory(historyBaru);
    localStorage.setItem("ai_chat", JSON.stringify(historyBaru));
}
        
        
    } catch (error) {
        console.log("error", error);
        setMessages([...newMessages, {role: "assistant", content: "Error occurred while fetching response"}]);
    }finally {
        setLoading(false);
    }



  };
  return (
  // Container utama dikunci agar tidak ada double scroll di halaman
  <div className="h-screen w-full flex flex-col bg-black overflow-hidden relative font-sans">
    
    {/* Judul yang melayang di tengah jika chat masih kosong */}
    {messages.length === 0 && (
      <div className="absolute inset-0 flex items-center justify-center -mt-20 pointer-events-none">
        <h2 className="text-xl sm:text-5xl text-white font-bold opacity-20 uppercase tracking-widest">
          Thunder AI
        </h2>
        <img src="/thunder.webp" alt="Thunder AI Logo" className="w-20 h-20" />
      </div>
    )}

    {/* AREA CHAT (Scrollable) */}
    <div className="flex-1 w-full overflow-y-auto p-4 md:p-10 space-y-8 scrollbar-hide pb-40">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            
            {/* Avatar Bulat */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
              msg.role === "user" ? "bg-gradient-to-tr from-blue-600 to-purple-600" : "bg-zinc-800 border border-zinc-700"
            }`}>
              {msg.role === "user" ? "U" : "AI"}
            </div>

            {/* Konten Pesan */}
            <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-2xl leading-relaxed text-sm md:text-base ${
                msg.role === "user" 
                ? "bg-[#2f2f2f] text-white rounded-tr-none" 
                : "bg-transparent text-zinc-200 border-none px-0"
              }`}>
                {msg.content}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-start animate-pulse">
          <div className="text-zinc-500 text-sm italic font-mono">AI sedang mengetik...</div>
        </div>
      )}

      {/* JANGKAR SCROLL (Penting!) */}
      <div ref={scrollRef} />
    </div>

    {/* AREA INPUT (Fixed di bawah dengan Absolute) */}
    <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
      <div className="max-w-3xl mx-auto">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  </div>
);
}
