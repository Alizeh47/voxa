'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  BarChart2
} from 'lucide-react';

const projectDetails = {
  id: 1,
  name: "Marketing Campaign",
  description: "Q4 Digital Marketing Strategy and Implementation",
  members: [
    { id: 1, name: "John Doe", role: "Project Lead", avatar: "/avatars/john.jpg" },
    { id: 2, name: "Jane Smith", role: "Marketing Specialist", avatar: "/avatars/jane.jpg" },
    { id: 3, name: "Mike Johnson", role: "Content Writer", avatar: "/avatars/mike.jpg" },
  ],
  progress: 75,
  dueDate: "2024-04-15",
  category: "Marketing",
  tasks: [
    { id: 1, title: "Market Research", status: "completed" },
    { id: 2, title: "Content Strategy", status: "in-progress" },
    { id: 3, title: "Social Media Planning", status: "pending" },
  ],
  updates: [
    {
      id: 1,
      user: "John Doe",
      message: "Updated the content strategy document",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      user: "Jane Smith",
      message: "Added new social media templates",
      timestamp: "5 hours ago"
    }
  ]
};

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Geometric Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto p-6 relative">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={item} className="mb-8">
            <h1 className="text-4xl font-cal font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              {projectDetails.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-grotesque">
              {projectDetails.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Section */}
              <motion.div variants={item}>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-cal font-semibold mb-4">Progress Overview</h2>
                    <div className="relative pt-4">
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{ width: `${projectDetails.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600"
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-sm font-medium font-inter text-gray-600 dark:text-gray-400">
                          Progress
                        </span>
                        <span className="text-sm font-medium font-inter text-blue-600 dark:text-blue-400">
                          {projectDetails.progress}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tasks Section */}
              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-cal font-semibold mb-4">Tasks</h2>
                    <div className="space-y-4">
                      {projectDetails.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${
                              task.status === 'completed' ? 'text-green-500' : 
                              task.status === 'in-progress' ? 'text-yellow-500' : 'text-gray-400'
                            }`} />
                            <span className="font-inter">{task.title}</span>
                          </div>
                          <span className="text-sm font-medium font-inter capitalize text-gray-600 dark:text-gray-400">
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Updates Section */}
              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-cal font-semibold mb-4">Recent Updates</h2>
                    <div className="space-y-4">
                      {projectDetails.updates.map((update) => (
                        <div
                          key={update.id}
                          className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <p className="font-medium font-inter">{update.message}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                              {update.user} • {update.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-cal font-semibold mb-4">Project Details</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Due Date</p>
                          <p className="font-medium font-inter">{new Date(projectDetails.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Team Size</p>
                          <p className="font-medium font-inter">{projectDetails.members.length} Members</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Team Members */}
              <motion.div variants={item}>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-cal font-semibold mb-4">Team Members</h2>
                    <div className="space-y-4">
                      {projectDetails.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium font-inter">{member.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-grotesque">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 