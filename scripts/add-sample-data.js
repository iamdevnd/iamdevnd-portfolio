// scripts/add-sample-data.js
const path = require('path');

// Explicitly load .env.local from project root
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

console.log('🔍 Environment Debug:');
console.log('Current directory:', __dirname);
console.log('Looking for .env.local at:', path.join(__dirname, '..', '.env.local'));
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('Service Account Key exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
console.log('Service Account Key length:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0);
console.log('');

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found');
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
      process.exit(1);
    }

    console.log('🔍 Decoding service account...');
    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedKey);

    console.log('✅ Service account decoded successfully');
    console.log('Project ID from service account:', serviceAccount.project_id);
    console.log('Client email:', serviceAccount.client_email);

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

// Sample projects data
const sampleProjects = [
  {
    id: 'ai-chat-application',
    title: 'AI-Powered Chat Application',
    description: 'A real-time chat application powered by OpenAI GPT-4, featuring intelligent responses, conversation management, and multi-user support with WebSocket integration.',
    excerpt: 'Real-time AI chat app with intelligent responses and conversation management.',
    longDescription: `# AI Chat Application

An intelligent chat application that provides real-time AI-powered conversations with advanced features and scalable architecture.

## Key Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **AI Integration**: Smart, context-aware responses powered by OpenAI GPT-4
- **Conversation Management**: Organize and search through chat history
- **Multi-user Support**: Handle multiple concurrent users seamlessly
- **Responsive Design**: Works perfectly on all devices and screen sizes
- **Message Persistence**: Chat history saved and searchable
- **User Authentication**: Secure user accounts and session management

## Technical Implementation

Built with modern technologies for optimal performance:
- Frontend: React 18, TypeScript, TailwindCSS
- Backend: Node.js, Express, Socket.io
- Database: MongoDB with optimized indexing
- AI: OpenAI GPT-4 API with custom prompt engineering
- Real-time: WebSocket connections with connection pooling

## Performance Metrics

- 💬 Processed over 10,000 messages
- 🤖 Achieved 99.9% AI response accuracy
- ⚡ Maintained sub-second response times
- 👥 Successfully supports 1000+ concurrent users
- 🔄 99.8% uptime with automatic failover`,
    slug: 'ai-chat-application',
    category: 'AI/ML',
    status: 'completed',
    technologies: ['React', 'Node.js', 'OpenAI API', 'Socket.io', 'MongoDB', 'TypeScript', 'TailwindCSS'],
    featuredImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1676277791608-ac54c8247f8f?w=1200&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&h=600&fit=crop&crop=center'
    ],
    githubUrl: 'https://github.com/iamdevnd/ai-chat-app',
    liveUrl: 'https://ai-chat-demo.vercel.app',
    demoUrl: 'https://ai-chat-demo.vercel.app/demo',
    challenges: 'Managing real-time connections at scale while ensuring consistent AI response quality across different conversation contexts and maintaining low latency.',
    solutions: 'Implemented efficient WebSocket connection pooling, fine-tuned AI prompts with conversation context management, and used Redis for session caching.',
    learnings: 'Gained deep insights into real-time architecture patterns, AI conversation flow optimization, and scalable WebSocket management strategies.',
    metaTitle: 'AI Chat App - Real-time Intelligent Conversations | Dev ND',
    metaDescription: 'An AI-powered chat application with real-time messaging, intelligent GPT-4 responses, and multi-user support. Built with React and Node.js.',
    featured: true,
    published: true,
    metrics: [
      { label: 'Messages Processed', value: '10,000+' },
      { label: 'AI Response Accuracy', value: '99.9%' },
      { label: 'Average Response Time', value: '<1s' },
      { label: 'Concurrent Users', value: '1,000+' },
      { label: 'Uptime', value: '99.8%' }
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'analytics-dashboard',
    title: 'Real-time Analytics Dashboard',
    description: 'A comprehensive business intelligence platform with real-time data visualization, advanced filtering, interactive charts, and automated reporting capabilities.',
    excerpt: 'Interactive data visualization dashboard with real-time analytics and business intelligence.',
    longDescription: `# Real-time Analytics Dashboard

A powerful analytics platform designed to transform complex business data into actionable insights with modern visualization techniques.

## Core Features

- **Real-time Visualization**: Live data updates with interactive charts and graphs
- **Advanced Filtering**: Complex data segmentation and filtering capabilities
- **Custom Dashboards**: Drag-and-drop dashboard builder for custom layouts
- **Export Capabilities**: Multiple export formats (PDF, Excel, CSV) for reports
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance Optimized**: Handles large datasets (1M+ records) efficiently
- **Role-based Access**: Secure access control with user permissions

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Visualization**: D3.js, Chart.js, Recharts
- **Database**: PostgreSQL with optimized queries
- **Caching**: Redis for performance optimization
- **API**: RESTful API with GraphQL endpoints
- **Deployment**: Vercel with edge functions

## Business Impact

- Reduced reporting time by 80%
- Improved decision-making speed by 60%
- Increased data accessibility across teams
- Automated 15+ manual reporting processes`,
    slug: 'analytics-dashboard',
    category: 'Web Development',
    status: 'completed',
    technologies: ['Next.js', 'D3.js', 'PostgreSQL', 'TypeScript', 'TailwindCSS', 'Redis', 'Chart.js'],
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&crop=center'
    ],
    githubUrl: 'https://github.com/iamdevnd/analytics-dashboard',
    liveUrl: 'https://analytics-demo.vercel.app',
    demoUrl: 'https://analytics-demo.vercel.app/demo',
    challenges: 'Optimizing performance for large datasets while maintaining smooth user interactions and real-time updates without overwhelming the browser.',
    solutions: 'Implemented virtual scrolling, data pagination, efficient caching strategies with Redis, and WebSocket connections for real-time updates.',
    learnings: 'Mastered advanced data visualization techniques, performance optimization patterns for large datasets, and real-time data streaming architectures.',
    metaTitle: 'Analytics Dashboard - Business Intelligence Platform | Dev ND',
    metaDescription: 'A comprehensive real-time analytics dashboard with data visualization, business intelligence, and automated reporting features.',
    featured: true,
    published: true,
    metrics: [
      { label: 'Data Points Processed', value: '1M+' },
      { label: 'Average Load Time', value: '<2s' },
      { label: 'Chart Types', value: '20+' },
      { label: 'Export Formats', value: '5' },
      { label: 'Active Users', value: '500+' }
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  },
  {
    id: 'ecommerce-platform',
    title: 'Modern E-commerce Platform',
    description: 'A full-featured e-commerce platform with payment processing, inventory management, order fulfillment, and comprehensive admin dashboard for online businesses.',
    excerpt: 'Complete e-commerce solution with modern features and admin controls.',
    longDescription: `# Modern E-commerce Platform

A scalable, feature-rich e-commerce solution built for businesses of all sizes with modern architecture and user experience.

## Core Features

- **Product Management**: Complete catalog management with variants, categories, and pricing
- **Payment Processing**: Secure payment integration with Stripe, PayPal, and Apple Pay
- **Order Management**: Comprehensive order tracking, fulfillment, and customer communication
- **Inventory Control**: Real-time inventory tracking with low-stock alerts
- **User Authentication**: Secure user accounts, profiles, and order history
- **Admin Dashboard**: Full administrative control panel with analytics
- **Search & Filtering**: Advanced product search with faceted filtering
- **Mobile Optimization**: Progressive Web App (PWA) capabilities

## Technical Architecture

- **Microservices**: Modular architecture for scalability and maintainability
- **API-First Design**: RESTful APIs with comprehensive documentation
- **Database Optimization**: Efficient queries and indexing strategies
- **Caching Layer**: Redis implementation for improved performance
- **Security**: SSL encryption, PCI compliance, and secure authentication
- **Testing**: Comprehensive test suite with 90%+ coverage
- **CI/CD**: Automated testing and deployment pipelines

## Performance Metrics

- Handles 10,000+ concurrent users
- 99.9% uptime with automatic scaling
- Sub-2 second page load times
- Mobile-first responsive design
- SEO optimized with perfect Lighthouse scores`,
    slug: 'ecommerce-platform',
    category: 'Full Stack',
    status: 'completed',
    technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis', 'Docker', 'TypeScript', 'Prisma', 'TailwindCSS'],
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&crop=center',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop&crop=center'
    ],
    githubUrl: 'https://github.com/iamdevnd/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    demoUrl: 'https://ecommerce-demo.vercel.app/store',
    challenges: 'Building a secure, scalable platform that handles high traffic, complex transactions, and maintains performance under load.',
    solutions: 'Implemented microservices architecture with robust caching, security measures, automated testing, and horizontal scaling capabilities.',
    learnings: 'Developed expertise in payment processing, security best practices, scalable architecture design, and e-commerce user experience optimization.',
    metaTitle: 'E-commerce Platform - Full-Stack Shopping Solution | Dev ND',
    metaDescription: 'A complete modern e-commerce platform with payment processing, inventory management, and comprehensive admin features.',
    featured: false,
    published: true,
    metrics: [
      { label: 'Products Managed', value: '5,000+' },
      { label: 'Transactions Processed', value: '50,000+' },
      { label: 'System Uptime', value: '99.9%' },
      { label: 'Page Load Time', value: '<2s' },
      { label: 'Customer Satisfaction', value: '4.8/5' }
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  }
];

async function addSampleData() {
  try {
    console.log('🚀 Adding sample projects to Firestore...\n');

    // Test Firestore connection first
    console.log('🔍 Testing Firestore connection...');
    const testDoc = db.collection('_test').doc('connection');
    await testDoc.set({ test: true, timestamp: admin.firestore.Timestamp.now() });
    await testDoc.delete();
    console.log('✅ Firestore connection successful\n');

    for (const project of sampleProjects) {
      console.log(`📝 Adding project: ${project.title}`);
      await db.collection('projects').doc(project.id).set(project);
      console.log(`✅ Successfully added: ${project.title}`);
    }

    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📊 Projects Summary:');
    console.log(`   • ${sampleProjects.length} total projects`);
    console.log(`   • ${sampleProjects.filter(p => p.featured).length} featured projects`);
    console.log(`   • ${sampleProjects.filter(p => p.published).length} published projects`);
    
    console.log('\n🔗 Next steps:');
    console.log('1. Visit http://localhost:3000 to see your projects');
    console.log('2. Login to admin panel at http://localhost:3000/admin/login');
    console.log('3. Test the contact form with your email setup');
    console.log('4. Customize the project content in Firestore or admin panel');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    console.error('\nError details:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 7) {
      console.error('\n🔧 Permission Denied Solutions:');
      console.error('1. Check Firestore Rules in Firebase Console');
      console.error('2. Ensure service account has Firestore permissions');
      console.error('3. Verify project ID matches your Firebase project');
    }
  } finally {
    process.exit(0);
  }
}

// Run the script
addSampleData();