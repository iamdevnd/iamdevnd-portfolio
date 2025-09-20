// scripts/add-sample-blog-data.js
const path = require('path');

// Explicitly load .env.local from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🔍 Adding Sample Blog Posts...');
console.log('Service Account Key exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
console.log('');

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found');
      process.exit(1);
    }

    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    process.exit(1);
  }
}

const db = admin.firestore();

// Sample blog posts data
const sampleBlogPosts = [
  {
    title: "Building AI-Powered Applications with Next.js and OpenAI",
    slug: "building-ai-powered-applications-nextjs-openai",
    excerpt: "Learn how to integrate OpenAI's GPT models into your Next.js applications for intelligent user experiences. This comprehensive guide covers setup, implementation, and best practices.",
    content: `# Building AI-Powered Applications with Next.js and OpenAI

In this comprehensive guide, we'll explore how to integrate OpenAI's powerful language models into your Next.js applications to create intelligent, responsive user experiences.

## What We'll Build

We'll create a smart content generation tool that can:
- Generate blog post ideas based on topics
- Create social media content
- Provide writing assistance and editing suggestions
- Analyze sentiment and tone

## Setting Up Your Development Environment

First, let's set up our Next.js project with the necessary dependencies:

\`\`\`bash
npx create-next-app@latest ai-content-generator
cd ai-content-generator
npm install openai @types/node
\`\`\`

## OpenAI API Integration

Here's how to set up the OpenAI client in your Next.js application:

\`\`\`typescript
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
\`\`\`

## Creating Smart API Routes

Next.js API routes make it easy to create server-side endpoints that interact with OpenAI:

\`\`\`typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful writing assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
\`\`\`

## Building the Frontend Interface

Create an intuitive interface for content generation:

\`\`\`tsx
'use client';

import { useState } from 'react';

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      setGenerated(data.content);
    } catch (error) {
      console.error('Generation failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full h-32 p-4 border rounded-lg"
      />
      <button
        onClick={generateContent}
        disabled={loading || !prompt}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>
      {generated && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Generated Content:</h3>
          <p className="whitespace-pre-wrap">{generated}</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

## Best Practices and Optimization

### 1. Rate Limiting
Implement rate limiting to prevent API abuse:

\`\`\`typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});
\`\`\`

### 2. Caching Responses
Cache common requests to reduce API costs:

\`\`\`typescript
import { unstable_cache } from 'next/cache';

const getCachedCompletion = unstable_cache(
  async (prompt: string) => {
    // OpenAI API call here
  },
  ['openai-completion'],
  { revalidate: 3600 } // Cache for 1 hour
);
\`\`\`

### 3. Error Handling
Implement comprehensive error handling:

\`\`\`typescript
try {
  const completion = await openai.chat.completions.create({...});
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error('OpenAI API Error:', error.message);
    return NextResponse.json(
      { error: 'AI service temporarily unavailable' },
      { status: 503 }
    );
  }
  throw error;
}
\`\`\`

## Production Considerations

When deploying to production, consider:

1. **Environment Variables**: Store API keys securely
2. **Usage Monitoring**: Track API usage and costs
3. **Content Moderation**: Filter inappropriate content
4. **User Authentication**: Protect expensive API calls
5. **Fallback Strategies**: Handle API downtime gracefully

## Conclusion

Integrating OpenAI with Next.js opens up incredible possibilities for creating intelligent applications. The combination of Next.js's full-stack capabilities and OpenAI's language models enables developers to build sophisticated AI-powered experiences with relatively simple code.

Start with small experiments and gradually build more complex features. The key is to focus on user value while managing costs and maintaining good performance.

Happy coding! 🚀`,
    author: {
      name: "Dev ND",
      email: "iamdevnd@gmail.com",
      avatar: "/images/avatar.jpg"
    },
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop"
    ],
    tags: ["Next.js", "OpenAI", "AI", "Tutorial", "React", "JavaScript"],
    category: "AI & Machine Learning",
    published: true,
    featured: true,
    readTime: 12,
    views: 1250,
    likes: 43,
    metaTitle: "Building AI-Powered Applications with Next.js and OpenAI - Complete Guide",
    metaDescription: "Learn how to integrate OpenAI's GPT models into Next.js applications. Complete tutorial with code examples, best practices, and production tips.",
    tableOfContents: [
      { id: "what-well-build", text: "What We'll Build", level: 2 },
      { id: "setting-up", text: "Setting Up Your Development Environment", level: 2 },
      { id: "openai-integration", text: "OpenAI API Integration", level: 2 },
      { id: "api-routes", text: "Creating Smart API Routes", level: 2 },
      { id: "frontend", text: "Building the Frontend Interface", level: 2 },
      { id: "best-practices", text: "Best Practices and Optimization", level: 2 },
      { id: "production", text: "Production Considerations", level: 2 }
    ]
  },
  {
    title: "The Future of Web Development: Server Components and Streaming",
    slug: "future-web-development-server-components-streaming",
    excerpt: "Explore how React Server Components and streaming are revolutionizing web development. Learn about the benefits, implementation strategies, and real-world use cases.",
    content: `# The Future of Web Development: Server Components and Streaming

React Server Components represent a paradigm shift in how we build web applications. Combined with streaming, they're reshaping the landscape of modern web development.

## Understanding Server Components

Server Components execute on the server and send rendered output to the client, rather than shipping JavaScript bundles. This approach offers several key advantages:

### Benefits of Server Components

1. **Reduced Bundle Size**: Server Components don't add to the client-side JavaScript bundle
2. **Better Performance**: Faster initial page loads and improved Core Web Vitals
3. **Direct Backend Access**: Query databases and access server-only resources directly
4. **Improved SEO**: Content is server-rendered and immediately available to crawlers

## Streaming for Better User Experience

Streaming allows you to progressively send HTML to the browser as it's generated:

\`\`\`tsx
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <div>
      <Header />
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails />
      </Suspense>
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews />
      </Suspense>
    </div>
  );
}
\`\`\`

## Implementation Strategies

### 1. Gradual Migration
Start by converting leaf components to Server Components:

\`\`\`tsx
// Server Component
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUserFromDatabase(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
\`\`\`

### 2. Data Fetching Patterns
Server Components enable new data fetching patterns:

\`\`\`tsx
// Multiple async operations can run in parallel
async function Dashboard() {
  const [user, notifications, analytics] = await Promise.all([
    getUser(),
    getNotifications(),
    getAnalytics()
  ]);

  return (
    <div>
      <UserWidget user={user} />
      <NotificationPanel notifications={notifications} />
      <AnalyticsChart data={analytics} />
    </div>
  );
}
\`\`\`

## Real-World Impact

Companies adopting Server Components report:
- 40-60% reduction in JavaScript bundle sizes
- 20-30% improvement in Core Web Vitals
- Simplified data fetching logic
- Better developer experience

## Challenges and Solutions

### Challenge: Client-Side Interactivity
**Solution**: Use the \`'use client'\` directive strategically

### Challenge: State Management
**Solution**: Combine Server Components with Client Components effectively

### Challenge: Caching Complexity
**Solution**: Leverage React's built-in caching mechanisms

## Getting Started Today

1. **Next.js 13+**: Built-in support for Server Components
2. **Start Small**: Convert static components first
3. **Measure Performance**: Use tools like Lighthouse and Core Web Vitals
4. **Learn Patterns**: Study successful implementations

## Conclusion

Server Components and streaming represent the future of web development. They solve fundamental performance issues while providing a better developer experience.

The key is to start experimenting today and gradually adopt these patterns in your applications.`,
    author: {
      name: "Dev ND", 
      email: "iamdevnd@gmail.com"
    },
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    tags: ["React", "Next.js", "Performance", "Web Development", "Server Components"],
    category: "Web Development",
    published: true,
    featured: true,
    readTime: 8,
    views: 890,
    likes: 32,
    metaTitle: "The Future of Web Development: Server Components and Streaming",
    metaDescription: "Explore React Server Components and streaming in modern web development. Learn benefits, implementation strategies, and real-world use cases."
  },
  {
    title: "5 Python Libraries Every AI Engineer Should Know in 2024",
    slug: "5-python-libraries-ai-engineer-2024",
    excerpt: "Discover the essential Python libraries that are shaping the AI landscape in 2024. From data processing to model deployment, these tools will accelerate your AI development workflow.",
    content: `# 5 Python Libraries Every AI Engineer Should Know in 2024

The AI ecosystem is evolving rapidly, with new libraries and tools emerging constantly. Here are five Python libraries that have become indispensable for AI engineers in 2024.

## 1. LangChain - Building AI Applications

LangChain has revolutionized how we build applications with large language models:

\`\`\`python
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

llm = OpenAI(temperature=0.7)
prompt = PromptTemplate(
    input_variables=["topic"],
    template="Write a blog post about {topic}"
)
chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run("machine learning")
\`\`\`

**Why it matters**: Simplifies building complex AI workflows and chains.

## 2. Streamlit - Rapid AI Prototyping

Create interactive AI applications in minutes:

\`\`\`python
import streamlit as st
import pandas as pd

st.title("AI Data Explorer")
uploaded_file = st.file_uploader("Choose a CSV file")

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    st.dataframe(df)
    
    if st.button("Generate Insights"):
        insights = analyze_data(df)
        st.write(insights)
\`\`\`

## 3. Hugging Face Transformers - Pre-trained Models

Access thousands of pre-trained models:

\`\`\`python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I love this new AI library!")
# [{'label': 'POSITIVE', 'score': 0.9998}]
\`\`\`

## 4. Weights & Biases - Experiment Tracking

Track and visualize your AI experiments:

\`\`\`python
import wandb

wandb.init(project="my-ai-project")
wandb.log({"accuracy": 0.95, "loss": 0.05})
\`\`\`

## 5. FastAPI - AI Model Deployment

Deploy AI models with automatic API documentation:

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictionRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict(request: PredictionRequest):
    result = model.predict(request.text)
    return {"prediction": result}
\`\`\`

## Conclusion

These libraries form the foundation of modern AI development. Start incorporating them into your workflow to build better AI applications faster.`,
    author: {
      name: "Dev ND",
      email: "iamdevnd@gmail.com"
    },
    featuredImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=630&fit=crop",
    tags: ["Python", "AI", "Machine Learning", "Libraries", "Tools"],
    category: "AI & Machine Learning", 
    published: true,
    featured: false,
    readTime: 6,
    views: 654,
    likes: 28,
    metaTitle: "5 Python Libraries Every AI Engineer Should Know in 2024",
    metaDescription: "Essential Python libraries for AI engineers in 2024. From LangChain to FastAPI, discover tools that will accelerate your AI development."
  },
  {
    title: "Building a Real-Time Chat Application with Next.js and WebSockets",
    slug: "real-time-chat-nextjs-websockets",
    excerpt: "Learn how to build a modern real-time chat application using Next.js, WebSockets, and React. Complete with user authentication, message persistence, and typing indicators.",
    content: `# Building a Real-Time Chat Application with Next.js and WebSockets

Real-time communication is essential for modern web applications. In this tutorial, we'll build a full-featured chat application using Next.js and WebSockets.

## Project Overview

Our chat application will include:
- Real-time messaging
- User authentication
- Message persistence
- Typing indicators
- Online user status
- Message history

## Setting Up the Project

\`\`\`bash
npx create-next-app@latest chat-app
cd chat-app
npm install socket.io socket.io-client next-auth
\`\`\`

## WebSocket Server Setup

Create a custom server for handling WebSocket connections:

\`\`\`javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send-message', (data) => {
      socket.to(data.roomId).emit('receive-message', data);
    });

    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user-typing', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('Server running on http://localhost:3000');
  });
});
\`\`\`

## Client-Side Implementation

Create the chat component:

\`\`\`tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: Date;
}

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);

    socketInstance.emit('join-room', roomId);

    socketInstance.on('receive-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('user-typing', (data) => {
      setTypingUsers(prev => [...prev, data.username]);
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user !== data.username));
      }, 3000);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        userId: 'current-user',
        username: 'Current User',
        timestamp: new Date(),
      };

      socket.emit('send-message', { ...message, roomId });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    if (socket && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', { roomId, username: 'Current User' });
      
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={\`flex \${
              message.userId === 'current-user' ? 'justify-end' : 'justify-start'
            }\`}
          >
            <div
              className={\`max-w-xs lg:max-w-md px-4 py-2 rounded-lg \${
                message.userId === 'current-user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }\`}
            >
              <p className="text-sm font-medium">{message.username}</p>
              <p>{message.text}</p>
              <p className="text-xs opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
\`\`\`

## Advanced Features

### Message Persistence
Store messages in a database:

\`\`\`javascript
// In your socket handler
socket.on('send-message', async (data) => {
  // Save to database
  await saveMessage(data);
  
  // Broadcast to room
  socket.to(data.roomId).emit('receive-message', data);
});
\`\`\`

### User Authentication
Integrate with NextAuth.js for secure user management.

### File Sharing
Add support for image and file uploads.

## Deployment Considerations

- Use Redis for scaling across multiple servers
- Implement rate limiting to prevent spam
- Add message encryption for security
- Monitor WebSocket connections and performance

## Conclusion

Building real-time features with Next.js and WebSockets opens up many possibilities for interactive applications. Start with this foundation and add features based on your specific needs.`,
    author: {
      name: "Dev ND",
      email: "iamdevnd@gmail.com"
    },
    featuredImage: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&h=630&fit=crop",
    tags: ["Next.js", "WebSockets", "Real-time", "React", "Tutorial"],
    category: "Web Development",
    published: true,
    featured: false,
    readTime: 15,
    views: 432,
    likes: 19,
    metaTitle: "Building a Real-Time Chat Application with Next.js and WebSockets",
    metaDescription: "Complete tutorial for building a real-time chat app with Next.js, WebSockets, user authentication, and message persistence."
  }
];

async function addSampleBlogPosts() {
  console.log('Starting to add sample blog posts...');
  
  try {
    for (let i = 0; i < sampleBlogPosts.length; i++) {
      const post = sampleBlogPosts[i];
      const now = new Date();
      
      const postData = {
        ...post,
        createdAt: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)), // Stagger creation dates
        updatedAt: now,
        publishedAt: post.published ? new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)) : null,
      };
      
      const docRef = await db.collection('blog').add(postData);
      console.log(`✅ Added blog post ${i + 1}: ${post.title}`);
      console.log(`   Document ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Successfully added all sample blog posts!');
    console.log('You should now see these posts in your blog.');
    
  } catch (error) {
    console.error('❌ Error adding sample blog posts:', error);
    
    if (error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
      console.log('\n💡 Make sure you have FIREBASE_SERVICE_ACCOUNT_KEY in your .env.local file');
    }
  }
}

// Run the script
addSampleBlogPosts()
  .then(() => {
    console.log('\n✨ Blog script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Blog script failed:', error);
    process.exit(1);
  });