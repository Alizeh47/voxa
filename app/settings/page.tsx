'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  Shield, 
  User, 
  Moon,
  Sun,
  Volume2,
  MessageSquare,
  Lock,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BackButton } from '@/components/ui/back-button';
import SharedLayout from '@/components/Layout/SharedLayout';

export default function SettingsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

    return (
    <SharedLayout>
      <div className="container mx-auto p-6 relative">
        {/* Geometric Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-96 h-96 bg-yellow-500 opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="mb-6">
          <BackButton />
      </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-cal font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-inter">
            Manage your account preferences and application settings
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 max-w-4xl"
        >
          {/* Account Settings */}
          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-cal font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group/item">
                    <div>
                      <h3 className="font-medium font-cal">Email Notifications</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Receive email updates about your account</p>
            </div>
                    <Button variant="ghost" className="group-hover/item:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
            </div>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group/item">
                    <div>
                      <h3 className="font-medium font-cal">Change Password</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Update your password regularly</p>
            </div>
                    <Button variant="ghost" className="group-hover/item:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
            </div>
            </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-cal font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Privacy Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group/item">
                    <div>
                      <h3 className="font-medium font-cal">Profile Visibility</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Control who can see your profile</p>
        </div>
                    <Button variant="ghost" className="group-hover/item:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
            </div>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group/item">
                    <div>
                      <h3 className="font-medium font-cal">Story Privacy</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Manage who can view your stories</p>
            </div>
                    <Button variant="ghost" className="group-hover/item:translate-x-1 transition-transform">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
              </div>
            </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Theme Settings */}
          <motion.div variants={item}>
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-cal font-semibold mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-yellow-500" />
                  Appearance
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <div>
                      <h3 className="font-medium font-cal">Theme</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Choose between light and dark mode</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="group/btn">
                        <Sun className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform" />
                        Light
                      </Button>
                      <Button variant="outline" size="sm" className="group/btn">
                        <Moon className="w-4 h-4 mr-2 group-hover/btn:rotate-90 transition-transform" />
                        Dark
                      </Button>
              </div>
            </div>
        </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </SharedLayout>
  );
} 