"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageSquare, Bot, User, Search, Trash2, Download, Calendar, Clock } from "lucide-react"

// Reduced sample data for faster loading
const sampleChatHistory = [
  {
    id: "1",
    title: "Blood Pressure Concerns",
    date: "2025-09-20",
    time: "10:30 AM",
    duration: "8 minutes",
    messageCount: 12,
    status: "completed",
    summary: "Discussed elevated blood pressure readings and lifestyle modifications",
    tags: ["blood pressure", "medication", "lifestyle"]
  },
  {
    id: "2", 
    title: "Medication Side Effects Query",
    date: "2025-09-18",
    time: "02:15 PM", 
    duration: "5 minutes",
    messageCount: 8,
    status: "completed",
    summary: "Asked about potential side effects of Metformin and management strategies",
    tags: ["medication", "side effects", "diabetes"]
  },
  {
    id: "3",
    title: "Diabetes Diet Consultation",
    date: "2025-09-15",
    time: "09:45 AM",
    duration: "12 minutes", 
    messageCount: 18,
    status: "completed",
    summary: "Comprehensive discussion about diabetes-friendly meal planning and nutrition",
    tags: ["diabetes", "nutrition", "meal planning"]
  }
]

const conversationSample = {
  id: "1",
  messages: [
    {
      id: "1",
      sender: "user",
      message: "Hi, I've been checking my blood pressure at home and it's been consistently high. Should I be worried?",
      timestamp: "2025-09-20T10:30:00Z"
    },
    {
      id: "2", 
      sender: "bot",
      message: "I understand your concern about elevated blood pressure readings. Can you share your recent readings with me? Also, are you currently taking any blood pressure medication?",
      timestamp: "2025-09-20T10:30:30Z"
    },
    {
      id: "3",
      sender: "user", 
      message: "My readings have been around 150/95 for the past week. I'm taking Lisinopril 10mg once daily.",
      timestamp: "2025-09-20T10:31:15Z"
    },
    {
      id: "4",
      sender: "bot",
      message: "Those readings are indeed elevated (normal is typically below 120/80). Since you're already on Lisinopril, it's important to consult with your doctor about possibly adjusting your medication. In the meantime, here are some lifestyle modifications that can help:\n\n• Reduce sodium intake\n• Regular exercise (30 min daily)\n• Stress management\n• Limit alcohol\n• Maintain healthy weight",
      timestamp: "2025-09-20T10:32:00Z"
    },
    {
      id: "5",
      sender: "user",
      message: "Should I contact my doctor right away or can this wait until my next appointment?",
      timestamp: "2025-09-20T10:33:00Z"
    },
    {
      id: "6",
      sender: "bot", 
      message: "Given that your readings are consistently elevated despite medication, I recommend contacting your doctor within the next few days rather than waiting. Blood pressure of 150/95 is in the Stage 2 hypertension range and may require medication adjustment.\n\nHowever, if you experience symptoms like severe headache, chest pain, or shortness of breath, seek immediate medical attention.",
      timestamp: "2025-09-20T10:33:45Z"
    }
  ]
}

export default function ChatHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const filteredChats = sampleChatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday" 
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              Chat History
            </h1>
            <p className="text-muted-foreground mt-2">
              Review your conversations with the AI health assistant
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Conversations</p>
                  <p className="text-2xl font-bold text-blue-600">{sampleChatHistory.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {sampleChatHistory.filter(chat => 
                      new Date(chat.date).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {sampleChatHistory.reduce((sum, chat) => sum + chat.messageCount, 0)}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                  <p className="text-2xl font-bold text-gray-600">7 min</p>
                </div>
                <Clock className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search conversations by topic, keywords, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>
                Your recent conversations with the AI health assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedChat === chat.id 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{chat.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(chat.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {chat.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {chat.messageCount} messages
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {chat.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {chat.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                
                {filteredChats.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No conversations found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or start a new conversation
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Conversation Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {selectedChat ? "Conversation Detail" : "Select Conversation"}
              </CardTitle>
              <CardDescription>
                {selectedChat ? "View the complete conversation thread" : "Choose a conversation to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedChat ? (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">Blood Pressure Concerns</h4>
                    <p className="text-sm text-muted-foreground">September 20, 2025 • 8 minutes</p>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {conversationSample.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-blue-100 ml-4"
                            : "bg-gray-100 mr-4"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "user" ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bot className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a conversation from the list to view its details and messages
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}