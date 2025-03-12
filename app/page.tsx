import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container-app py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-primary">Voxa</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Features</a>
            <a href="#about" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">About</a>
            <a href="#contact" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Contact</a>
          </nav>
          <div className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container-app py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real-time messaging for professionals
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Streamline your team communication with Voxa, the secure messaging platform built for businesses, digital marketers, and content creators.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/signup" className="btn-primary text-center">
                Get Started
              </Link>
              <a href="#features" className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Learn More
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Placeholder for hero image */}
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 w-full flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">App Screenshot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-primary-light dark:bg-primary-dark rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Messaging</h3>
              <p className="text-gray-600 dark:text-gray-300">Instant one-on-one and group messaging with typing indicators, read receipts, and reaction support.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Media & File Sharing</h3>
              <p className="text-gray-600 dark:text-gray-300">Share images, videos, audio, and documents with drag-and-drop uploads and a 100 MB file size limit.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-accent-light dark:bg-accent-dark rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice & Video Calls</h3>
              <p className="text-gray-600 dark:text-gray-300">High-quality voice and video calls with screen sharing capabilities for seamless collaboration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary dark:bg-primary-dark">
        <div className="container-app text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Voxa for their communication needs.
          </p>
          <Link href="/signup" className="px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition-colors">
            Sign up for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-primary">Voxa</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Real-time messaging for professionals</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Voxa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
