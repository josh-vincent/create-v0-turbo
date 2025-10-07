"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@tocld/ui/button"
import { Card, CardContent } from "@tocld/ui/card"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@tocld/ui/conversation"
import { ConversationBar } from "@tocld/ui/conversation-bar"
import { Message, MessageContent } from "@tocld/ui/message"
import { Orb } from "@tocld/ui/orb"
import { Response } from "@tocld/ui/response"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tocld/ui/tooltip"

const DEFAULT_AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export default function VoiceChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showSetupBanner, setShowSetupBanner] = useState(!DEFAULT_AGENT_ID)

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Voice Chat</h2>
        <p className="text-muted-foreground">
          Powered by ElevenLabs Conversational AI
        </p>
      </div>

      {/* Setup Banner - Only shown when ELEVENLABS_AGENT_ID is missing */}
      {showSetupBanner && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔶</span>
                  <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                    ElevenLabs Agent Not Configured
                  </h3>
                </div>
                <p className="text-xs text-orange-800 dark:text-orange-200">
                  Voice chat requires an ElevenLabs Conversational AI agent. The interface is available in demo mode.
                </p>
                <details className="text-xs text-orange-700 dark:text-orange-300">
                  <summary className="cursor-pointer font-medium hover:underline">
                    Setup Instructions
                  </summary>
                  <ol className="mt-2 ml-4 list-decimal space-y-1">
                    <li>
                      Create account at{" "}
                      <a
                        href="https://elevenlabs.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline dark:text-orange-400"
                      >
                        elevenlabs.io
                      </a>
                    </li>
                    <li>Create a Conversational AI agent</li>
                    <li>Copy your agent ID</li>
                    <li>
                      Add to <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">.env.local</code>:
                      <pre className="mt-1 p-2 bg-orange-100 dark:bg-orange-900 rounded text-[10px]">
                        NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
                      </pre>
                    </li>
                    <li>Restart your dev server</li>
                  </ol>
                </details>
              </div>
              <button
                onClick={() => setShowSetupBanner(false)}
                className="shrink-0 rounded-full p-1 text-orange-600 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-900/50 transition-colors"
                aria-label="Dismiss banner"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="flex h-[calc(100vh-280px)] w-full flex-col gap-0 overflow-hidden">
        <CardContent className="relative flex-1 overflow-hidden p-0">
          <Conversation className="absolute inset-0 pb-[88px]">
            <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-6">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Orb className="size-12" />}
                  title={!DEFAULT_AGENT_ID ? "Demo Mode" : "Start a conversation"}
                  description={
                    !DEFAULT_AGENT_ID
                      ? "Configure an ElevenLabs agent to enable voice chat"
                      : "Tap the phone button or type a message to begin"
                  }
                />
              ) : (
                messages.map((message, index) => {
                  return (
                    <div key={index} className="flex w-full flex-col gap-1">
                      <Message from={message.role}>
                        <MessageContent className="max-w-full min-w-0">
                          <Response className="w-auto [overflow-wrap:anywhere] whitespace-pre-wrap">
                            {message.content}
                          </Response>
                        </MessageContent>
                        {message.role === "assistant" && (
                          <div className="ring-border size-6 flex-shrink-0 self-end overflow-hidden rounded-full ring-1">
                            <Orb className="h-full w-full" />
                          </div>
                        )}
                      </Message>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className={cn(
                                    "text-muted-foreground hover:text-foreground relative size-9 p-1.5"
                                  )}
                                  size="sm"
                                  type="button"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      message.content
                                    )
                                    setCopiedIndex(index)
                                    setTimeout(() => setCopiedIndex(null), 2000)
                                  }}
                                >
                                  {copiedIndex === index ? (
                                    <CheckIcon className="size-4" />
                                  ) : (
                                    <CopyIcon className="size-4" />
                                  )}
                                  <span className="sr-only">
                                    {copiedIndex === index ? "Copied!" : "Copy"}
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {copiedIndex === index ? "Copied!" : "Copy"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-[100px]" />
          </Conversation>
          <div className="absolute right-0 bottom-0 left-0 flex justify-center">
            <ConversationBar
              className="w-full max-w-2xl"
              agentId={DEFAULT_AGENT_ID || "demo-mode"}
              onConnect={() => setMessages([])}
              onDisconnect={() => setMessages([])}
              onSendMessage={(message) => {
                const userMessage: ChatMessage = {
                  role: "user",
                  content: message,
                }
                setMessages((prev) => [...prev, userMessage])
              }}
              onMessage={(message) => {
                const newMessage: ChatMessage = {
                  role: message.source === "user" ? "user" : "assistant",
                  content: message.message,
                }
                setMessages((prev) => [...prev, newMessage])
              }}
              onError={(error) => console.error("Conversation error:", error)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
