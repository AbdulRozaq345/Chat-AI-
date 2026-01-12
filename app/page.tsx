"use client";
import { PlaceholdersAndVanishInputDemo } from "@/components/placeholder";
import { SidebarDemo } from "@/components/sidebar";
import{useState, useEffect} from "react";
import { useSession } from "next-auth/react";


export default function Home() {
  const {data: session} = useSession()
  const [chatHistory, setChatHistory] = useState<{id: string; title: string; messages: any[];}[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ai_chat");
    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  const handleNewChat = (id: string) => {
    setActiveChatId(null);
  }

  const handleSelectChat = ( id: string) => {
    setActiveChatId(id);
    const selected = chatHistory.find((c) => c.id === id);

    if (selected) {
     
    }
  } 

  const handleDeleteChat = (id: string) => {
    const historyBaru = chatHistory.filter((c)=> c.id !== id);
    setChatHistory(historyBaru);
    localStorage.setItem("ai_chat", JSON.stringify(historyBaru));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden  font-sans dark:bg-black">
      <div className="h-full ">
      <SidebarDemo chatHistory={chatHistory}  onSelectChat={handleSelectChat} onNewChat={handleNewChat} onDeleteChat={handleDeleteChat}/>
      </div>
    <main className="flex-1 h-full relative overflow-hidden ">
      <PlaceholdersAndVanishInputDemo
      setChatHistory={setChatHistory}
      chatHistory={chatHistory}
      setActiveChatId={setActiveChatId}
      activeChatId={activeChatId}
      userName={session?.user?.name || "User"}
       />
    </main>
    </div>
  );
}
