import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { AssistantInput } from "./AssistantInput";
import { askAssistant } from "../../services/assistantService";
import type { Task } from "../../types/task.types";
import { searchTasks } from "../../utils/taskSearch";
import { getTaskAnalytics } from "../../utils/taskAnalytics";
import { useAssistantVoice } from "../../hooks/useAssistantVoice";

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];

  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

type Message = {
  sender: "user" | "ai";
  message: string;
};

export function AssistantPanel({
  open,
  onClose,
  tasks,
  onDelete,
  onToggleComplete,
}: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      message: "Hi 👋 I'm TaskPilot AI. Ask me anything about your tasks.",
    },
  ]);

  // #6: ref for auto-scrolling the chat to the latest message
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const { listening, startListening } = useAssistantVoice((text) => {
    void handleSend(text);
  });

  async function handleSend(message: string) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        message,
      },
    ]);

    const lower = message.toLowerCase();

    // #4: broader search keywords (find/show/search/locate/where)
    if (
      lower.includes("find") ||
      lower.includes("show") ||
      lower.includes("search") ||
      lower.includes("locate") ||
      lower.includes("where")
    ) {
      // #4: regex replace so repeated keywords/plurals are all stripped,
      // not just the first occurrence (.replace() with a string only hits once)
      const cleanedQuery = lower
        .replace(/where's|where is|find|show|search|locate|tasks?/g, "")
        .trim();

      const results = searchTasks(cleanedQuery, tasks);

      if (results.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: "❌ I couldn't find any matching tasks.",
          },
        ]);

        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message:
            "🔍 I found:\n\n" +
            results.map((task) => `• ${task.title}`).join("\n"),
        },
      ]);

      return;
    }

    const analytics = getTaskAnalytics(tasks);

    if (
      lower.includes("how many") ||
      lower.includes("overdue") ||
      lower.includes("completed") ||
      lower.includes("pending") ||
      lower.includes("today") ||
      lower.includes("left") ||
      lower.includes("high") ||
      lower.includes("urgent") ||
      lower.includes("priority")
    ) {
      let reply = "";

      if (lower.includes("left") || lower.includes("pending")) {
        reply = `📋 You have ${analytics.pending} pending task(s).`;
      } else if (lower.includes("completed")) {
        reply = `✅ You have completed ${analytics.completed} task(s).`;
      } else if (lower.includes("overdue")) {
        reply = `⚠️ You have ${analytics.overdue} overdue task(s).`;
      } else if (lower.includes("today")) {
        reply = `📅 You have ${analytics.today} task(s) due today.`;
      } else if (
        lower.includes("high") ||
        lower.includes("urgent") ||
        lower.includes("priority")
      ) {
        reply = `🔥 You have ${analytics.highPriority} high priority task(s).`;
      } else {
        // #2/#3 follow-on: fallback so `reply` is never sent empty
        reply = "🤔 I'm not sure how to answer that one yet.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: reply,
        },
      ]);

      return;
    }

    // #2 + #3: all `action`-dependent logic now lives INSIDE the try block,
    // so a thrown error never falls through to code that uses `action`
    // while it's undefined, and a successful call can't "leak" past catch.
    try {
      const action = await askAssistant(message, tasks);

      if (action.action === "delete") {
        const task = tasks.find((t) =>
          t.title.toLowerCase().includes(action.taskTitle.toLowerCase())
        );

        if (task) {
          onDelete(task.id);

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              message: `🗑 Deleted "${task.title}".`,
            },
          ]);

          return;
        }

        // #3 follow-on: previously this case fell through to code that
        // referenced `action` outside its scope. Now it resolves cleanly.
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: `❌ I couldn't find a task matching "${action.taskTitle}".`,
          },
        ]);

        return;
      }

      if (action.action === "complete") {
        const task = tasks.find((t) =>
          t.title.toLowerCase().includes(action.taskTitle.toLowerCase())
        );

        if (task) {
          onToggleComplete(task.id);

          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              message: `✅ Completed "${task.title}".`,
            },
          ]);

          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            message: `❌ I couldn't find a task matching "${action.taskTitle}".`,
          },
        ]);

        return;
      }

      const replyMessage =
        "reply" in action
          ? action.reply
          : "Sorry, I couldn't process that request.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: replyMessage,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          message: "⚠️ Sorry, I couldn't process that request.",
        },
      ]);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 250,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">🤖 TaskPilot AI</h2>

              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <X />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="h-[400px] overflow-y-auto space-y-4"
            >
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  sender={msg.sender}
                  message={msg.message}
                />
              ))}
            </div>

            <AssistantInput
              onSend={handleSend}
              listening={listening}
              onStartListening={startListening}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
