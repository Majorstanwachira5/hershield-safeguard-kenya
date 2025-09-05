import React, { useState } from 'react';
import { AlertTriangle, Camera, Mic, MapPin, Clock, Shield, Send, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';

const ReportIncident = () => {
  const [step, setStep] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const incidentTypes = [
    { value: 'harassment', label: 'Online Harassment', description: 'Unwanted messages, stalking, or threatening behavior' },
    { value: 'cyberbullying', label: 'Cyberbullying', description: 'Repeated harmful behavior online' },
    { value: 'doxxing', label: 'Doxxing', description: 'Sharing private information without consent' },
    { value: 'image-abuse', label: 'Image-based Abuse', description: 'Non-consensual sharing of intimate images' },
    { value: 'impersonation', label: 'Impersonation', description: 'Someone pretending to be you online' },
    { value: 'threats', label: 'Threats of Violence', description: 'Direct or implied threats of physical harm' },
    { value: 'other', label: 'Other', description: 'Other form of digital abuse or safety concern' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-yellow-500', description: 'Occasional incidents, minimal impact' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-500', description: 'Regular incidents, noticeable impact' },
    { value: 'high', label: 'High', color: 'bg-red-500', description: 'Frequent incidents, significant impact' },
    { value: 'critical', label: 'Critical', color: 'bg-red-700', description: 'Ongoing severe incidents, requires immediate attention' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments([...attachments, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Handle report submission
    alert('Report submitted successfully. You will receive a confirmation email shortly.');
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
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold">Report an Incident</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Your safety is our priority. This secure form helps us understand what happened and how we can help you.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={step >= 1 ? 'text-primary font-medium' : ''}>Incident Type</span>
              <span className={step >= 2 ? 'text-primary font-medium' : ''}>Details</span>
              <span className={step >= 3 ? 'text-primary font-medium' : ''}>Evidence</span>
              <span className={step >= 4 ? 'text-primary font-medium' : ''}>Review</span>
            </div>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Your privacy is protected.</strong> All reports are encrypted and handled confidentially. 
              You can choose to report anonymously or provide contact information for follow-up support.
            </AlertDescription>
          </Alert>

          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              {/* Step 1: Incident Type */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">What type of incident would you like to report?</h3>
                    <p className="text-muted-foreground">Select the category that best describes what happened.</p>
                  </div>

                  <RadioGroup value={incidentType} onValueChange={setIncidentType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incidentTypes.map((type) => (
                      <div key={type.value} className="relative">
                        <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col p-4 border-2 rounded-lg cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 transition-all"
                        >
                          <span className="font-semibold">{type.label}</span>
                          <span className="text-sm text-muted-foreground mt-1">{type.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      I want to report this anonymously
                    </Label>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Incident Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Tell us more about what happened</h3>
                    <p className="text-muted-foreground">Provide as much detail as you feel comfortable sharing.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="severity" className="text-base font-medium">How severe is this incident?</Label>
                      <RadioGroup value={severity} onValueChange={setSeverity} className="mt-3 space-y-3">
                        {severityLevels.map((level) => (
                          <div key={level.value} className="flex items-center space-x-3">
                            <RadioGroupItem value={level.value} id={level.value} />
                            <Label htmlFor={level.value} className="flex items-center gap-3 cursor-pointer">
                              <div className={`w-4 h-4 rounded-full ${level.color}`} />
                              <div>
                                <span className="font-medium">{level.label}</span>
                                <p className="text-sm text-muted-foreground">{level.description}</p>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-base font-medium">Description of the incident</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what happened, when it occurred, who was involved, and any other relevant details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-2 min-h-32"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {description.length}/2000 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-base font-medium">Where did this happen?</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="location"
                          placeholder="Platform, website, or physical location..."
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="flex-1"
                        />
                        <Button variant="outline" size="default">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Evidence Upload */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Upload Evidence (Optional)</h3>
                    <p className="text-muted-foreground">Screenshots, messages, or other evidence can help us understand the situation better.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Drag and drop files here</p>
                      <p className="text-muted-foreground mb-4">or</p>
                      <div className="space-x-2">
                        <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                        <Button variant="outline">
                          <Mic className="h-4 w-4 mr-2" />
                          Record Audio
                        </Button>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,audio/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-4">
                        Supported: Images, Audio, PDF, Word documents (Max 10MB each)
                      </p>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Uploaded Files:</h4>
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Upload className="h-4 w-4" />
                              <span className="text-sm">{file.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        All files are encrypted and stored securely. Only authorized personnel can access uploaded evidence.
                      </AlertDescription>
                    </Alert>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review and Submit */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Review Your Report</h3>
                    <p className="text-muted-foreground">Please review the information before submitting.</p>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Incident Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="font-medium">Type:</Label>
                            <p>{incidentTypes.find(t => t.value === incidentType)?.label}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Severity:</Label>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${severityLevels.find(s => s.value === severity)?.color}`} />
                              {severityLevels.find(s => s.value === severity)?.label}
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium">Location:</Label>
                            <p>{location || 'Not specified'}</p>
                          </div>
                          <div>
                            <Label className="font-medium">Reporting:</Label>
                            <div className="flex items-center gap-2">
                              {isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              {isAnonymous ? 'Anonymous' : 'With contact information'}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="font-medium">Description:</Label>
                          <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{description}</p>
                        </div>

                        {attachments.length > 0 && (
                          <div>
                            <Label className="font-medium">Attachments:</Label>
                            <p className="text-sm">{attachments.length} file(s) uploaded</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Next Steps:</strong> You'll receive a confirmation email with your report ID. 
                        Our safety team will review your report within 24 hours and may contact you for additional information.
                      </AlertDescription>
                    </Alert>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {step < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      disabled={
                        (step === 1 && !incidentType) ||
                        (step === 2 && (!severity || !description.trim()))
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={!incidentType || !severity || !description.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="max-w-4xl mx-auto mt-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Need Immediate Help?</h3>
              </div>
              <p className="text-red-700 mb-4">
                If you're in immediate danger or need urgent assistance, don't wait to submit a report.
              </p>
              <div className="flex gap-4">
                <Button variant="destructive">
                  Call Emergency Services (999)
                </Button>
                <Button variant="outline" className="border-red-300 hover:bg-red-100">
                  Contact Crisis Helpline
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportIncident;
