import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Shield, Plus, Search, Filter, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('groups');

  const supportGroups = [
    {
      id: 1,
      name: "Cyber Safety Warriors",
      description: "A community for sharing digital safety tips and experiences",
      members: 1247,
      posts: 89,
      category: "Safety",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
      isJoined: true,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Mental Health Support",
      description: "Safe space for mental wellbeing discussions and support",
      members: 892,
      posts: 156,
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100",
      isJoined: false,
      lastActive: "5 minutes ago"
    },
    {
      id: 3,
      name: "Career Women Kenya",
      description: "Professional networking and workplace safety discussions",
      members: 2156,
      posts: 234,
      category: "Professional",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100",
      isJoined: true,
      lastActive: "1 hour ago"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50",
      title: "How to handle online harassment - My experience",
      content: "I wanted to share some strategies that worked for me when dealing with persistent online harassment...",
      group: "Cyber Safety Warriors",
      likes: 23,
      comments: 8,
      time: "3 hours ago",
      tags: ["harassment", "safety", "support"]
    },
    {
      id: 2,
      author: "Grace K.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50",
      title: "Mental health resources in Nairobi",
      content: "Compiled a list of accessible mental health resources for women in Nairobi. Hope this helps someone...",
      group: "Mental Health Support",
      likes: 45,
      comments: 12,
      time: "5 hours ago",
      tags: ["resources", "mental-health", "nairobi"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Digital Safety Workshop",
      date: "March 15, 2024",
      time: "2:00 PM EAT",
      attendees: 89,
      type: "Virtual",
      host: "HerShield Team"
    },
    {
      id: 2,
      title: "Women in Tech Meetup",
      date: "March 22, 2024",
      time: "6:00 PM EAT",
      attendees: 156,
      type: "In-Person",
      host: "Career Women Kenya"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Community</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Connect with like-minded women, share experiences, and build a supportive network for digital safety and wellbeing.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups, posts, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="posts">Recent Posts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Support Groups */}
            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supportGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={group.image} />
                              <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <Badge variant="secondary" className="mt-1">{group.category}</Badge>
                            </div>
                          </div>
                          {group.isJoined && (
                            <Badge variant="default" className="bg-green-500">
                              <Shield className="h-3 w-3 mr-1" />
                              Joined
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{group.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {group.members.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {group.posts}
                            </span>
                          </div>
                          <span>Active {group.lastActive}</span>
                        </div>
                        <Button 
                          className="w-full" 
                          variant={group.isJoined ? "outline" : "default"}
                        >
                          {group.isJoined ? "View Group" : "Join Group"}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Recent Posts */}
            <TabsContent value="posts" className="space-y-6">
              {recentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={post.avatar} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{post.author}</span>
                            <Badge variant="outline" className="text-xs">{post.group}</Badge>
                          </div>
                          <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                          <p className="text-muted-foreground text-sm">{post.time}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            {/* Events */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{event.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">Hosted by {event.host}</p>
                          </div>
                          <Badge variant={event.type === 'Virtual' ? 'default' : 'secondary'}>
                            {event.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                        <Button className="w-full">Register for Event</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Resources */}
            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Safety Guidelines</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive guides for staying safe online
                    </p>
                    <Button variant="outline" size="sm">View Resources</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Mental Health</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Professional support and wellness resources
                    </p>
                    <Button variant="outline" size="sm">Get Support</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 text-center">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Legal Aid</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Legal resources and professional contacts
                    </p>
                    <Button variant="outline" size="sm">Find Help</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
