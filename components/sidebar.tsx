"use client";
import React, { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconSearch,
  IconSettings,
  IconPlus,
  IconMessage2,
  IconTrash,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { button, div } from "framer-motion/client";
import { LogIn } from "lucide-react";

export function SidebarDemo({
  chatHistory,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: any) {
  const links = [
    {
      label: "New Chat",
      href: "#",
      icon: (
        <IconPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: onNewChat,
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredCHistory = chatHistory.filter((chat: any) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { data: session } = useSession();
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <>
              <Logo />
            </>

            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={link.onClick}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
            {open && (
              <div className="px-2 mb-4 mt-5">
                <p className="text-[10px] text-neutral-200 uppercase mb-2 shrink-0 flex">
                  {" "}
                  <IconSearch className="h-4 w-4 shrink-0 text-neutral-700 dark:text-neutral-200 " />
                  Search
                </p>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search chats..."
                  className="w-full bg-neutral-900 text-xs text-white border border-neutral-700 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="mt-4 border-t border-neutral-800 pt-4 flex flex-col gap-2">
              {open && (
                <p className="text-[10px] text-neutral-200 uppercase font-bold px-2 mb-2 tracking-widest">
                  Chat History
                </p>
              )}

              {filteredCHistory.length > 0
                ? filteredCHistory.map((chat: any) => (
                    <div
                      key={chat.id}
                      className="group relative flex items-center pr-2"
                    >
                      <div
                        className="flex-1"
                        onClick={() => onSelectChat(chat.id)}
                      >
                        <SidebarLink
                          link={{
                            label: chat.title,
                            href: "#",
                            icon: (
                              <IconMessage2 className="h-5 w-5 shrink-0 rounded-full bg-neutral-600" />
                            ),
                          }}
                        />
                      </div>
                      {open && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-md transition-all"
                        >
                          <IconTrash className="h-4 w-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  ))
                : open && (
                    <p className="text-sm text-neutral-500 px-2">
                      No chat found.
                    </p>
                  )}
            </div>
          </div>
          <div className="mt-auto border border-neutral-800 pt-4">
            {session ? (
              <div className="group relative">
                <SidebarLink
                  link={{
                    label: session.user?.name || "User",
                    href: "#",
                    icon: (
                      <img
                        src={session.user?.image || "/default-avatar.png"}
                        className="h-7 w-7 shrink-0 rounded-full"
                        alt="Avatar"
                      />
                    ),
                  }}
                />
                {open && (
                  <button
                    onClick={() => signOut()}
                    className="absolute right-2 top-2 text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
    <button
      onClick={() => signIn("google")}
      className="w-full group relative flex gap-3 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
     >
      <div className="h-7 w-7 shrink-0 flex items-center justify-center bg-white rounded-full p-1">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>
      {open && (
        <span className="text-sm font-medium text-neutral-100 group-hover:text-white transition-colors">
          Sign In with Google
        </span>
      )}
    </button>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white uppercase tracking-widest"
      >
        Thunder AI
      </motion.span>
      <img src="/thunder.webp" alt="thunder" className="w-8 h-8" />
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
