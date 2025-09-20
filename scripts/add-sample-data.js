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
    title: "ContextCache - LLM Memory Engine",
    description: "Open-source hybrid retrieval system that achieves 40% faster recall than vector-only approaches through intelligent caching and ranking algorithms.",
    excerpt: "Engineered hybrid retrieval system combining FAISS, PageRank, and time-decay algorithms for superior LLM memory performance.",
    longDescription: "ContextCache is an innovative open-source LLM memory engine that revolutionizes how language models recall and utilize information. By combining FAISS vector search with PageRank algorithms and time-decay mechanisms, the system achieves 40% faster recall compared to traditional vector-only approaches. The hybrid retrieval system intelligently caches frequently accessed information while maintaining relevance through sophisticated ranking algorithms. Built with performance and scalability in mind, ContextCache includes a comprehensive CLI tool for easy integration and management.",
    featuredImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=600&fit=crop"
    ],
    technologies: ["Python", "FastAPI", "ArangoDB", "React", "Next.js", "Docker", "JWT", "spaCy", "FAISS"],
    category: "AI/ML",
    githubUrl: "https://github.com/iamdevnd/contextcache",
    liveUrl: "",
    demoUrl: "",
    featured: true,
    published: true,
    slug: "contextcache-llm-memory-engine",
    status: "completed",
    metaTitle: "ContextCache - Open-Source LLM Memory Engine",
    metaDescription: "Hybrid retrieval system achieving 40% faster recall vs vector-only approaches with FAISS, PageRank, and time-decay algorithms.",
    challenges: "The main challenge was optimizing retrieval speed while maintaining accuracy across different types of queries. Traditional vector-only approaches were fast but lacked contextual understanding, while graph-based methods were more accurate but slower.",
    solutions: "Implemented a hybrid approach that combines the speed of FAISS vector search with the contextual understanding of PageRank algorithms. Added time-decay mechanisms to ensure recent information is prioritized while maintaining historical context relevance.",
    learnings: "Learned the importance of balancing multiple algorithmic approaches to achieve optimal performance. Understanding the trade-offs between speed and accuracy in information retrieval systems was crucial for the project's success.",
    metrics: [
      { title: "Recall Speed Improvement", value: "40%", description: "Faster than vector-only approaches" },
      { title: "Query Response Time", value: "<200ms", description: "Average response time" },
      { title: "Accuracy Retention", value: "95%", description: "Maintained high accuracy" }
    ]
  },
  {
    title: "NDSecure - Encrypted Note Sharing",
    description: "End-to-end encrypted note-sharing platform with self-destructing messages, built for security-conscious users requiring ultra-fast performance.",
    excerpt: "AES-256 encrypted, self-destructing notes with sub-200ms retrieval supporting 1k+ concurrent users.",
    longDescription: "NDSecure is a cutting-edge encrypted note-sharing platform designed for users who prioritize security without compromising performance. The application features end-to-end AES-256 encryption, ensuring that sensitive information remains protected at all times. Self-destructing notes provide an additional layer of security by automatically removing content after specified time periods or read counts. The platform is engineered to handle over 1,000 concurrent users while maintaining sub-200ms retrieval times, making it both secure and highly performant.",
    featuredImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop"
    ],
    technologies: ["React", "Django REST", "PostgreSQL", "JWT", "Docker", "AES-256", "Vercel", "Render"],
    category: "Web Application",
    githubUrl: "https://github.com/iamdevnd/ndsecure",
    liveUrl: "https://ndsecure-demo.vercel.app",
    demoUrl: "https://ndsecure-demo.vercel.app",
    featured: true,
    published: true,
    slug: "ndsecure-encrypted-note-sharing",
    status: "completed",
    metaTitle: "NDSecure - End-to-End Encrypted Note Sharing Platform",
    metaDescription: "Secure note-sharing with AES-256 encryption, self-destructing messages, and sub-200ms performance for 1k+ concurrent users.",
    challenges: "Balancing strong encryption with high performance was the primary challenge. Implementing self-destructing notes while maintaining data integrity and ensuring the system could handle high concurrent loads required careful architecture planning.",
    solutions: "Optimized the encryption/decryption process by implementing efficient key management and caching strategies. Used connection pooling and database indexing to maintain fast retrieval times even under high load.",
    learnings: "Gained deep insights into cryptographic implementations and performance optimization techniques. Understanding the importance of security-first design while maintaining excellent user experience.",
    metrics: [
      { title: "Retrieval Time", value: "<200ms", description: "Average response time" },
      { title: "Concurrent Users", value: "1000+", description: "Supported simultaneously" },
      { title: "Encryption Standard", value: "AES-256", description: "Military-grade security" }
    ]
  },
  {
    title: "Sentiment Analytics - Streaming Intelligence",
    description: "Large-scale sentiment analysis system processing 50k+ Amazon reviews with real-time insights and predictive analytics for retail intelligence.",
    excerpt: "PySpark ETL pipeline ingesting 50k+ Amazon reviews with sentiment correlation and product recommendation engine.",
    longDescription: "Sentiment Analytics is a comprehensive streaming retail intelligence platform that processes over 50,000 Amazon product reviews to extract actionable business insights. The system employs a robust PySpark ETL pipeline to ingest, process, and analyze review data in real-time. Advanced sentiment analysis algorithms correlate customer emotions with product ratings, identifying trends and patterns that drive purchasing decisions.",
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["Python", "PySpark", "AWS S3", "TextBlob", "FP-Growth", "Power BI", "Docker", "Apache Spark"],
    category: "Data Science",
    githubUrl: "https://github.com/iamdevnd/sentiment-analytics",
    liveUrl: "",
    demoUrl: "",
    featured: false,
    published: true,
    slug: "sentiment-analytics-streaming-intelligence",
    status: "completed",
    metaTitle: "Sentiment Analytics - Streaming Retail Intelligence Platform",
    metaDescription: "PySpark ETL pipeline processing 50k+ Amazon reviews with sentiment analysis and product recommendation engine.",
    challenges: "Processing large volumes of unstructured review data while maintaining real-time performance was challenging. Ensuring accuracy in sentiment analysis across diverse product categories and customer demographics required sophisticated NLP techniques.",
    solutions: "Implemented distributed processing with PySpark to handle large data volumes efficiently. Used advanced text preprocessing and sentiment analysis models to improve accuracy across different domains.",
    learnings: "Mastered large-scale data processing techniques and gained experience with cloud-native data architectures. Understanding the importance of data quality and preprocessing in achieving accurate analytical results.",
    metrics: [
      { title: "Reviews Processed", value: "50k+", description: "Daily processing capacity" },
      { title: "Processing Speed", value: "1000/min", description: "Reviews per minute" },
      { title: "Accuracy Rate", value: "94%", description: "Sentiment classification accuracy" }
    ]
  }
];

async function addSampleProjects() {
  console.log('Starting to add sample projects...');
  
  try {
    for (let i = 0; i < sampleProjects.length; i++) {
      const project = sampleProjects[i];
      const projectData = {
        ...project,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };
      
      const docRef = await db.collection('projects').add(projectData);
      console.log(`✅ Added project ${i + 1}: ${project.title}`);
      console.log(`   Document ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 Successfully added all sample projects!');
    console.log('You should now see these projects in your portfolio.');
    
  } catch (error) {
    console.error('❌ Error adding sample projects:', error);
    
    if (error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
      console.log('\n💡 Make sure you have FIREBASE_SERVICE_ACCOUNT_KEY in your .env.local file');
    }
  }
}

// Run the script
addSampleProjects()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });