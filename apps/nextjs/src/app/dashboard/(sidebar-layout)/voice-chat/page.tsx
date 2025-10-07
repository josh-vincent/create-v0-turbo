"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

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

  if (!DEFAULT_AGENT_ID) {
    return (
      <div className="flex-1 space-y-6 p-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Voice Chat</h2>
          <p className="text-muted-foreground">
            Powered by ElevenLabs Conversational AI
          </p>
        </div>

        <Card className="max-w-2xl p-8">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Orb className="size-12" />
              <h3 className="text-xl font-semibold">Setup Required</h3>
            </div>
            <p className="text-muted-foreground">
              To use the voice chat feature, you need to configure an ElevenLabs AI agent.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Create an account at{" "}
                <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  elevenlabs.io
                </a>
              </li>
              <li>Create a Conversational AI agent in the dashboard</li>
              <li>Copy your agent ID</li>
              <li>Add it to your <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file:
                <pre className="mt-2 p-2 bg-muted rounded text-xs">
                  NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
                </pre>
              </li>
              <li>Restart your development server</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Voice Chat</h2>
        <p className="text-muted-foreground">
          Powered by ElevenLabs Conversational AI
        </p>
      </div>

      {/* Chat Interface */}
      <Card className="flex h-[calc(100vh-280px)] w-full flex-col gap-0 overflow-hidden">
        <CardContent className="relative flex-1 overflow-hidden p-0">
          <Conversation className="absolute inset-0 pb-[88px]">
            <ConversationContent className="flex min-w-0 flex-col gap-2 p-6 pb-6">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<Orb className="size-12" />}
                  title="Start a conversation"
                  description="Tap the phone button or type a message to begin"
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
              agentId={DEFAULT_AGENT_ID}
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
