import { Shield, Eye, EyeOff, Users, Bell, Lock, Globe, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const PrivacyControlCenter = () => {
  const [visibilitySettings, setVisibilitySettings] = useState({
    profile: "friends",
    location: false,
    activity: "private",
    contacts: "trusted"
  });

  const [notifications, setNotifications] = useState({
    safetyAlerts: true,
    communityUpdates: false,
    emergencyOnly: true,
    mentorMessages: true
  });

  const [advancedSecurity, setAdvancedSecurity] = useState({
    twoFactor: true,
    deviceTracking: true,
    loginAlerts: true,
    dataEncryption: true
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Privacy Control Center</h2>
          <p className="text-muted-foreground">Manage your safety and privacy settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visibility Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visibility & Sharing
            </CardTitle>
            <CardDescription>
              Control who can see your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select value={visibilitySettings.profile} onValueChange={(value) => 
                setVisibilitySettings(prev => ({ ...prev, profile: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Share Location</Label>
                <p className="text-sm text-muted-foreground">Allow trusted contacts to see your location</p>
              </div>
              <Switch
                checked={visibilitySettings.location}
                onCheckedChange={(checked) => 
                  setVisibilitySettings(prev => ({ ...prev, location: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Activity Status</Label>
              <Select value={visibilitySettings.activity} onValueChange={(value) => 
                setVisibilitySettings(prev => ({ ...prev, activity: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visible">Visible to All</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Contact Sharing</Label>
              <Select value={visibilitySettings.contacts} onValueChange={(value) => 
                setVisibilitySettings(prev => ({ ...prev, contacts: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trusted">Trusted Circle Only</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="none">No One</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what alerts you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Safety Alerts</Label>
                <p className="text-sm text-muted-foreground">Immediate threat notifications</p>
              </div>
              <Switch
                checked={notifications.safetyAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, safetyAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Community Updates</Label>
                <p className="text-sm text-muted-foreground">Safety tips and community news</p>
              </div>
              <Switch
                checked={notifications.communityUpdates}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, communityUpdates: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Emergency Only Mode</Label>
                <p className="text-sm text-muted-foreground">Only critical safety notifications</p>
              </div>
              <Switch
                checked={notifications.emergencyOnly}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, emergencyOnly: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Mentor Messages</Label>
                <p className="text-sm text-muted-foreground">Communication from safety mentors</p>
              </div>
              <Switch
                checked={notifications.mentorMessages}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, mentorMessages: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Advanced Security
            </CardTitle>
            <CardDescription>
              Enhanced protection features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Extra layer of account security</p>
              </div>
              <Switch
                checked={advancedSecurity.twoFactor}
                onCheckedChange={(checked) => 
                  setAdvancedSecurity(prev => ({ ...prev, twoFactor: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Device Tracking</Label>
                <p className="text-sm text-muted-foreground">Monitor unusual login locations</p>
              </div>
              <Switch
                checked={advancedSecurity.deviceTracking}
                onCheckedChange={(checked) => 
                  setAdvancedSecurity(prev => ({ ...prev, deviceTracking: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Notifications for new device logins</p>
              </div>
              <Switch
                checked={advancedSecurity.loginAlerts}
                onCheckedChange={(checked) => 
                  setAdvancedSecurity(prev => ({ ...prev, loginAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Data Encryption</Label>
                <p className="text-sm text-muted-foreground">End-to-end encryption for messages</p>
              </div>
              <Switch
                checked={advancedSecurity.dataEncryption}
                onCheckedChange={(checked) => 
                  setAdvancedSecurity(prev => ({ ...prev, dataEncryption: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Kenyan Context Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Local Support Integration
            </CardTitle>
            <CardDescription>
              Connect with Kenyan safety resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Kenya Police Service</p>
                  <p className="text-xs text-muted-foreground">Emergency: 999 | Non-emergency: 0800 020 220</p>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Gender-Based Violence Helpline</p>
                  <p className="text-xs text-muted-foreground">24/7 Support: 1195</p>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Local Women's Groups</p>
                  <p className="text-xs text-muted-foreground">Community support networks</p>
                </div>
                <Button variant="outline" size="sm">
                  Find Groups
                </Button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm font-medium text-primary">Language Support</p>
              <p className="text-xs text-muted-foreground mt-1">
                HerShield supports Swahili, English, and local languages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button size="lg" className="px-8">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacyControlCenter;