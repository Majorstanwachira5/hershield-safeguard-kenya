import React, { useState } from 'react';
import { Search, Book, Phone, Heart, Shield, MapPin, Download, ExternalLink, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const emergencyContacts = [
    {
      id: 1,
      name: "Gender Violence Recovery Centre",
      phone: "+254-20-2717374",
      description: "24/7 support for gender-based violence survivors",
      location: "Nairobi",
      verified: true,
      type: "Crisis Support"
    },
    {
      id: 2,
      name: "LVCT Health",
      phone: "+254-20-3860000",
      description: "Comprehensive health and counseling services",
      location: "Nairobi",
      verified: true,
      type: "Health"
    },
    {
      id: 3,
      name: "Childline Kenya",
      phone: "116",
      description: "Free 24/7 helpline for children and young people",
      location: "National",
      verified: true,
      type: "Youth Support"
    }
  ];

  const safetyGuides = [
    {
      id: 1,
      title: "Digital Privacy Essentials",
      description: "Complete guide to protecting your online privacy and personal information",
      category: "Privacy",
      downloadCount: 2847,
      rating: 4.9,
      fileType: "PDF",
      size: "2.3 MB",
      lastUpdated: "March 2024"
    },
    {
      id: 2,
      title: "Social Media Safety Handbook",
      description: "Best practices for safe social media usage and harassment prevention",
      category: "Social Media",
      downloadCount: 1923,
      rating: 4.8,
      fileType: "PDF",
      size: "1.8 MB",
      lastUpdated: "February 2024"
    },
    {
      id: 3,
      title: "Cyberbullying Response Guide",
      description: "Step-by-step guide for dealing with online harassment and cyberbullying",
      category: "Harassment",
      downloadCount: 3156,
      rating: 4.9,
      fileType: "PDF",
      size: "2.1 MB",
      lastUpdated: "March 2024"
    }
  ];

  const mentalHealthResources = [
    {
      id: 1,
      name: "Befrienders Kenya",
      description: "Suicide prevention and emotional support",
      contact: "+254-722-178177",
      website: "befrienderskenya.org",
      services: ["Crisis Counseling", "Peer Support", "Training"],
      availability: "24/7"
    },
    {
      id: 2,
      name: "Amani Counselling Centre",
      description: "Professional counseling and therapy services",
      contact: "+254-20-3861690",
      website: "amanicounselling.com",
      services: ["Individual Therapy", "Group Counseling", "Trauma Support"],
      availability: "Mon-Fri 8AM-6PM"
    }
  ];

  const legalResources = [
    {
      id: 1,
      name: "Federation of Women Lawyers (FIDA)",
      description: "Free legal aid for women facing gender-based violence",
      contact: "+254-20-3874938",
      website: "fida.co.ke",
      services: ["Legal Representation", "Legal Advice", "Court Accompaniment"],
      location: "Nairobi, Mombasa, Kisumu"
    },
    {
      id: 2,
      name: "Legal Aid Centre",
      description: "Free legal services for low-income individuals",
      contact: "+254-20-2716060",
      website: "legalaid.go.ke",
      services: ["Legal Consultation", "Representation", "Document Drafting"],
      location: "Multiple locations"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', count: 15 },
    { id: 'emergency', label: 'Emergency', count: 8 },
    { id: 'safety', label: 'Safety Guides', count: 12 },
    { id: 'mental-health', label: 'Mental Health', count: 6 },
    { id: 'legal', label: 'Legal Aid', count: 4 }
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
              <Book className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Resources</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Comprehensive collection of safety guides, emergency contacts, and support resources to help you stay safe online and offline.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources, guides, contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  {category.label}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <Tabs defaultValue="guides" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guides">Safety Guides</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
              <TabsTrigger value="legal">Legal Aid</TabsTrigger>
            </TabsList>

            {/* Safety Guides */}
            <TabsContent value="guides" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {safetyGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2">{guide.category}</Badge>
                            <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                            <CardDescription>{guide.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {guide.downloadCount.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {guide.rating}
                              </div>
                            </div>
                            <span>{guide.size}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Updated {guide.lastUpdated}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {guide.fileType}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Emergency Contacts */}
            <TabsContent value="emergency" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {emergencyContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-all duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              {contact.verified && (
                                <Badge variant="default" className="bg-green-500">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-2">{contact.type}</Badge>
                            <CardDescription>{contact.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="font-mono font-semibold">{contact.phone}</span>
                            <Button size="sm" variant="outline">Call Now</Button>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{contact.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Emergency Actions */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button variant="destructive" size="lg" className="h-16">
                      <div className="text-center">
                        <Phone className="h-6 w-6 mx-auto mb-1" />
                        <div>Call 999</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="h-16 border-red-300 hover:bg-red-50">
                      <div className="text-center">
                        <MapPin className="h-6 w-6 mx-auto mb-1" />
                        <div>Share Location</div>
                      </div>
                    </Button>
                    <Button variant="outline" size="lg" className="h-16 border-red-300 hover:bg-red-50">
                      <div className="text-center">
                        <Shield className="h-6 w-6 mx-auto mb-1" />
                        <div>Silent Alert</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mental Health Resources */}
            <TabsContent value="mental-health" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mentalHealthResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-pink-500" />
                          {resource.name}
                        </CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Availability:</span>
                            <Badge variant={resource.availability.includes('24/7') ? 'default' : 'secondary'}>
                              {resource.availability}
                            </Badge>
                          </div>
                          
                          <div>
                            <span className="font-semibold mb-2 block">Services:</span>
                            <div className="flex flex-wrap gap-2">
                              {resource.services.map((service, serviceIndex) => (
                                <Badge key={serviceIndex} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            <Button variant="outline">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Website
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Legal Aid */}
            <TabsContent value="legal" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {legalResources.map((legal, index) => (
                  <motion.div
                    key={legal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-500" />
                          {legal.name}
                        </CardTitle>
                        <CardDescription>{legal.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{legal.location}</span>
                          </div>
                          
                          <div>
                            <span className="font-semibold mb-2 block">Services Available:</span>
                            <div className="flex flex-wrap gap-2">
                              {legal.services.map((service, serviceIndex) => (
                                <Badge key={serviceIndex} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1">
                              <Phone className="h-4 w-4 mr-2" />
                              Get Legal Help
                            </Button>
                            <Button variant="outline">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Website
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;
