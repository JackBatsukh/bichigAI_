"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import ChatInterface from "@/components/chat/chatinterface";

export default function ChatPage() {
  return (
    <div className="w-full min-h-screen overflow-hidden ">
      <ChatInterface />
    </div>
  );
}
