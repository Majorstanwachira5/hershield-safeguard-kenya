import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  MessageCircle, 
  Shield, 
  Zap, 
  Users,
  Navigation,
  Siren,
  Heart,
  Hospital,
  Home,
  Copy,
  ExternalLink
} from "lucide-react";
import { aiAPI, emergencyAPI } from "@/lib/api";
import { toast } from "sonner";

interface EmergencyResponse {
  immediateActions: string[];
  emergencyContacts: Array<{
    name: string;
    number: string;
    description: string;
  }>;
  safetyInstructions: string[];
  localResources: Array<{
    name: string;
    location: string;
    contact: string;
    services: string[];
    description: string;
  }>;
  followUpSteps: string[];
  isUrgent: boolean;
}

const EMERGENCY_TYPES = [
  { value: 'assault', label: 'Physical Assault', urgent: true, icon: '🚨' },
  { value: 'domestic_violence', label: 'Domestic Violence', urgent: true, icon: '🏠' },
  { value: 'sexual_harassment', label: 'Sexual Harassment', urgent: true, icon: '⚠️' },
  { value: 'stalking', label: 'Stalking', urgent: false, icon: '👁️' },
  { value: 'cyberbullying', label: 'Cyberbullying', urgent: false, icon: '💻' },
  { value: 'harassment', label: 'General Harassment', urgent: false, icon: '📢' },
  { value: 'threats_of_violence', label: 'Threats of Violence', urgent: true, icon: '💀' },
  { value: 'kidnapping', label: 'Kidnapping/Abduction', urgent: true, icon: '🚗' },
  { value: 'robbery', label: 'Robbery/Theft', urgent: true, icon: '💰' },
  { value: 'medical_emergency', label: 'Medical Emergency', urgent: true, icon: '🏥' }
];

export const AIEmergencyCenter: React.FC = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [immediateHelp, setImmediateHelp] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [response, setResponse] = useState<EmergencyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Auto-detect location
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Reverse geocoding to get address
          fetch(`https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results[0]) {
                const address = data.results[0].formatted;
                setUserLocation(prev => ({ ...prev!, address }));
                if (!location) {
                  setLocation(address);
                }
              }
            })
            .catch(() => {
              toast.error('Unable to get address from coordinates');
            });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to access location. Please enter manually.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  }, [location]);

  useEffect(() => {
    // Auto-detect location on component mount
    getCurrentLocation();
  }, [getCurrentLocation]);

  const generateEmergencyResponse = async () => {
    if (!emergencyType) {
      toast.error('Please select an emergency type');
      return;
    }

    if (immediateHelp && !location.trim()) {
      toast.error('Location is required for immediate help');
      return;
    }

    setLoading(true);
    try {
      const response = await aiAPI.generateEmergencyResponse({
        emergencyType,
        location: location || userLocation?.address || 'Kenya',
        immediateHelp,
        details: details || undefined
      });

      if (response.data.success) {
        setResponse(response.data.data);
        setEmergencyActive(true);
        
        // Show urgent notification if needed
        if (response.data.data.isUrgent) {
          toast.error('URGENT: Emergency response generated!', {
            description: 'Please follow the immediate actions below.',
            duration: 10000
          });
        } else {
          toast.success('Emergency response generated successfully');
        }
      } else {
        throw new Error(response.data.message || 'Failed to generate emergency response');
      }
    } catch (error) {
      console.error('Emergency response error:', error);
      toast.error('Failed to generate emergency response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerEmergencyAlert = async () => {
    if (!emergencyType || !location.trim()) {
      toast.error('Please fill in emergency type and location');
      return;
    }

    try {
      await emergencyAPI.triggerAlert({
        emergencyType,
        location: location.trim(),
        severity: immediateHelp ? 'critical' : 'high',
        description: details || undefined,
        contactInfo: contactName && contactPhone ? {
          name: contactName,
          phone: contactPhone
        } : undefined
      });

      toast.success('Emergency alert triggered! Authorities have been notified.');
      setEmergencyActive(true);
    } catch (error) {
      console.error('Emergency alert error:', error);
      toast.error('Failed to trigger emergency alert. Please call 911 directly.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getEmergencyTypeInfo = (type: string) => {
    return EMERGENCY_TYPES.find(t => t.value === type);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-red-600">Emergency Response Center</h2>
        <p className="text-muted-foreground">
          AI-powered emergency assistance and rapid response coordination
        </p>
      </div>

      {emergencyActive && (
        <Alert className="bg-red-50 border-red-200">
          <Siren className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Emergency Mode Active</AlertTitle>
          <AlertDescription className="text-red-700">
            Emergency protocols are in effect. Follow the guidance below and contact authorities if needed.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Emergency Details
              </CardTitle>
              <CardDescription>
                Provide information about your emergency situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Type *</label>
                <Select value={emergencyType} onValueChange={setEmergencyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select emergency type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMERGENCY_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                          {type.urgent && <Badge variant="destructive" className="text-xs">URGENT</Badge>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {emergencyType && getEmergencyTypeInfo(emergencyType)?.urgent && (
                  <Alert variant="destructive">
                    <Siren className="h-4 w-4" />
                    <AlertDescription>
                      This is classified as an urgent emergency. Consider calling 911 immediately.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Your Location *
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={loading}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Detect Location
                  </Button>
                </div>
                <Input
                  placeholder="Enter your current location (address, landmark, etc.)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {userLocation && (
                  <p className="text-xs text-muted-foreground">
                    Detected coordinates: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details</label>
                <Textarea
                  placeholder="Provide any additional details about the emergency..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="immediate-help"
                  checked={immediateHelp}
                  onCheckedChange={setImmediateHelp}
                />
                <label htmlFor="immediate-help" className="text-sm font-medium">
                  I need immediate help (this will prioritize your request)
                </label>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Emergency Contact Name
                  </label>
                  <Input
                    placeholder="Your name or contact person"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Contact Phone Number
                  </label>
                  <Input
                    placeholder="+254XXXXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateEmergencyResponse}
                  disabled={loading || !emergencyType}
                  className="flex-1"
                  variant={immediateHelp ? "destructive" : "default"}
                >
                  {loading ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Get Emergency Guidance
                    </>
                  )}
                </Button>
                
                {immediateHelp && (
                  <Button 
                    onClick={triggerEmergencyAlert}
                    disabled={loading || !emergencyType || !location}
                    variant="destructive"
                  >
                    <Siren className="h-4 w-4 mr-2" />
                    Alert Authorities
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Hotlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Kenya Police</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => callNumber('911')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      911
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('911')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Emergency (Alt)</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => callNumber('999')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      999
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('999')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gender Violence Recovery Centre</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => callNumber('+254709991000')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('+254 709 991 000')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Childline Kenya</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => callNumber('116')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      116
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('116')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open('https://usikimye.or.ke', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Report to Usikimye
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={getCurrentLocation}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Share Location
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const message = `EMERGENCY: I need help at ${location || 'unknown location'}. Emergency type: ${emergencyType}. Please contact me immediately.`;
                  copyToClipboard(message);
                }}
                disabled={!emergencyType || !location}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Copy Emergency Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {response && (
        <div className="space-y-6">
          <Alert className={response.isUrgent ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"}>
            <Siren className="h-4 w-4" />
            <AlertTitle className={response.isUrgent ? "text-red-800" : "text-orange-800"}>
              Emergency Response Generated
            </AlertTitle>
            <AlertDescription className={response.isUrgent ? "text-red-700" : "text-orange-700"}>
              {response.isUrgent 
                ? "This is a high-priority emergency. Please follow the immediate actions below."
                : "Emergency guidance has been prepared. Please review the recommendations."
              }
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {response.immediateActions.length > 0 && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Siren className="h-5 w-5" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {response.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{action}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {response.emergencyContacts.map((contact, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{contact.name}</h4>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => callNumber(contact.number)}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(contact.number)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{contact.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Safety Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.safetyInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {response.localResources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="h-5 w-5" />
                  Local Resources & Support Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {response.localResources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{resource.name}</h4>
                          <p className="text-sm text-muted-foreground">{resource.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => callNumber(resource.contact)}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {resource.services.map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {response.followUpSteps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Follow-up Actions
                </CardTitle>
                <CardDescription>
                  Important steps to take after the immediate situation is resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.followUpSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
