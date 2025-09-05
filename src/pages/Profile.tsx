import React, { useState } from 'react';
import { User, Settings, Shield, Bell, Lock, Eye, EyeOff, Edit3, Save, X, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Mwangi',
    email: 'sarah.mwangi@email.com',
    phone: '+254-712-345678',
    location: 'Nairobi, Kenya',
    bio: 'Passionate about digital safety and women empowerment.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  });

  const [safetySettings, setSafetySettings] = useState({
    aiProtection: true,
    realTimeScanning: true,
    emergencyContacts: true,
    locationSharing: false,
    anonymousReporting: true,
    threatDetection: true,
    messageFiltering: 85,
    privacyLevel: 'high'
  });

  const [notifications, setNotifications] = useState({
    safetyAlerts: true,
    weeklyReports: true,
    communityUpdates: false,
    emergencyAlerts: true,
    aiInsights: true,
    systemUpdates: true
  });

  const safetyScore = 89;
  const recentActivity = [
    { type: 'scan', message: 'Blocked 3 suspicious messages', time: '2 hours ago', severity: 'low' },
    { type: 'update', message: 'Privacy settings updated', time: '1 day ago', severity: 'info' },
    { type: 'alert', message: 'New safety tip available', time: '2 days ago', severity: 'info' },
    { type: 'threat', message: 'Potential threat detected and blocked', time: '3 days ago', severity: 'medium' }
  ];

  const emergencyContacts = [
    { name: 'Grace Wanjiku (Sister)', phone: '+254-722-123456', verified: true },
    { name: 'Dr. Jane Kamau', phone: '+254-733-987654', verified: true },
    { name: 'Emergency Helpline', phone: '+254-20-2717374', verified: true }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset changes
  };

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
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">My Profile</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Manage your personal information, safety settings, and privacy preferences.
            </p>
          </div>

          {/* Profile Overview Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-muted-foreground">{profileData.email}</p>
                    </div>
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>

                  {/* Safety Score */}
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Safety Score</span>
                        <Badge variant="default" className="bg-green-600">
                          {safetyScore}/100
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${safetyScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Excellent! Your safety settings are optimized.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="safety">Safety Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                      <Badge variant="default" className="bg-green-600">Verified</Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>
                    People who can be contacted in case of an emergency.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.verified && (
                            <Badge variant="default" className="bg-green-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Add Emergency Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety Settings */}
            <TabsContent value="safety" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    AI Protection Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how HerShield protects you online.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Real-time AI Protection</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically scan and filter harmful content
                      </p>
                    </div>
                    <Switch
                      checked={safetySettings.aiProtection}
                      onCheckedChange={(checked) => setSafetySettings({...safetySettings, aiProtection: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Threat Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Detect and block potential threats automatically
                      </p>
                    </div>
                    <Switch
                      checked={safetySettings.threatDetection}
                      onCheckedChange={(checked) => setSafetySettings({...safetySettings, threatDetection: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Message Filtering Sensitivity</Label>
                    <p className="text-sm text-muted-foreground">
                      Higher values block more content but may have false positives
                    </p>
                    <div className="px-3">
                      <Slider
                        value={[safetySettings.messageFiltering]}
                        onValueChange={([value]) => setSafetySettings({...safetySettings, messageFiltering: value})}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Permissive</span>
                        <span className="font-medium">{safetySettings.messageFiltering}%</span>
                        <span>Strict</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Anonymous Reporting</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous incident reports by default
                      </p>
                    </div>
                    <Switch
                      checked={safetySettings.anonymousReporting}
                      onCheckedChange={(checked) => setSafetySettings({...safetySettings, anonymousReporting: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Privacy Level</Label>
                    <Select
                      value={safetySettings.privacyLevel}
                      onValueChange={(value) => setSafetySettings({...safetySettings, privacyLevel: value})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Basic protection</SelectItem>
                        <SelectItem value="medium">Medium - Balanced protection</SelectItem>
                        <SelectItem value="high">High - Maximum protection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Location Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Share location with trusted contacts in emergencies
                      </p>
                    </div>
                    <Switch
                      checked={safetySettings.locationSharing}
                      onCheckedChange={(checked) => setSafetySettings({...safetySettings, locationSharing: checked})}
                    />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Notice:</strong> HerShield uses end-to-end encryption and never shares 
                      your personal data with third parties without your explicit consent.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Safety Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Immediate alerts for security threats and incidents
                      </p>
                    </div>
                    <Switch
                      checked={notifications.safetyAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, safetyAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Emergency Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Critical emergency notifications (cannot be disabled)
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emergencyAlerts}
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">AI Insights</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly safety insights and personalized tips
                      </p>
                    </div>
                    <Switch
                      checked={notifications.aiInsights}
                      onCheckedChange={(checked) => setNotifications({...notifications, aiInsights: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Community Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates from community groups and forums
                      </p>
                    </div>
                    <Switch
                      checked={notifications.communityUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, communityUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        App updates and maintenance notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, systemUpdates: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Log */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent safety activities and system interactions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          activity.severity === 'high' ? 'bg-red-500' :
                          activity.severity === 'medium' ? 'bg-orange-500' :
                          activity.severity === 'low' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge
                          variant={activity.severity === 'high' ? 'destructive' : 
                                 activity.severity === 'medium' ? 'default' : 'secondary'}
                        >
                          {activity.severity}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button variant="outline">View Full Activity Log</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
