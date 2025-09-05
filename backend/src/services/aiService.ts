import OpenAI from 'openai';
import { logger } from '../utils/logger';

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      logger.warn('OpenAI API key not found. AI features will use fallback analysis.');
    }
  }

  // Analyze message for threats and safety concerns
  async analyzeMessage(message: string, context: string): Promise<{
    threatLevel: number;
    detectedThreats: string[];
    confidence: number;
    recommendations: string[];
    sentiment: string;
  }> {
    try {
      if (this.openai) {
        const prompt = `
Analyze this message for safety threats and harassment patterns, especially those targeting women and girls in Kenya:

Message: "${message}"
Context: ${context}

Please analyze for:
1. Harassment, cyberbullying, stalking
2. Sexual harassment or inappropriate content
3. Threats of violence or intimidation
4. Hate speech or discrimination
5. Doxxing attempts or privacy violations
6. Cultural or gender-specific threats relevant to Kenyan women

Provide a JSON response with:
- threatLevel (0-10, where 10 is most dangerous)
- detectedThreats (array of threat types)
- confidence (0-1)
- recommendations (array of safety advice)
- sentiment (positive/neutral/negative/hostile)

Focus on protecting women's safety and consider Kenyan cultural context.
`;

        const response = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
          temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          try {
            return JSON.parse(content);
          } catch {
            // Fallback to pattern-based analysis if JSON parsing fails
            return this.fallbackMessageAnalysis(message, context);
          }
        }
      }

      return this.fallbackMessageAnalysis(message, context);
    } catch (error) {
      logger.error('AI message analysis error:', error);
      return this.fallbackMessageAnalysis(message, context);
    }
  }

  // Detect threats in content
  async detectThreats(content: string): Promise<{
    threats: string[];
    riskLevel: string;
    confidence: number;
    suggestedActions: string[];
  }> {
    try {
      const analysis = await this.analyzeMessage(content, 'general');
      
      let riskLevel = 'low';
      if (analysis.threatLevel >= 8) riskLevel = 'critical';
      else if (analysis.threatLevel >= 6) riskLevel = 'high';
      else if (analysis.threatLevel >= 4) riskLevel = 'medium';

      const suggestedActions = this.generateSuggestedActions(analysis.threatLevel, analysis.detectedThreats);

      return {
        threats: analysis.detectedThreats,
        riskLevel,
        confidence: analysis.confidence,
        suggestedActions
      };
    } catch (error) {
      logger.error('Threat detection error:', error);
      return {
        threats: [],
        riskLevel: 'low',
        confidence: 0,
        suggestedActions: ['Consider reviewing the content for potential safety concerns']
      };
    }
  }

  // Moderate content for appropriateness
  async moderateContent(content: string): Promise<{
    isAppropriate: boolean;
    flags: string[];
    categories: string[];
    severity: string;
    suggestedAction: string;
  }> {
    try {
      if (this.openai) {
        const response = await this.openai.moderations.create({
          input: content,
        });

        const result = response.results[0];
        const flags: string[] = [];
        const categories: string[] = [];

        Object.entries(result.categories).forEach(([category, flagged]) => {
          if (flagged) {
            categories.push(category);
          }
        });

        Object.entries(result.category_scores).forEach(([category, score]) => {
          if (score > 0.7) {
            flags.push(`High ${category} content detected`);
          }
        });

        const severity = result.flagged ? 
          (Object.values(result.category_scores).some(score => score > 0.8) ? 'high' : 'medium') : 
          'low';

        return {
          isAppropriate: !result.flagged,
          flags,
          categories,
          severity,
          suggestedAction: result.flagged ? 'Content should be reviewed or blocked' : 'Content appears appropriate'
        };
      }

      return this.fallbackContentModeration(content);
    } catch (error) {
      logger.error('Content moderation error:', error);
      return this.fallbackContentModeration(content);
    }
  }

  // Analyze for harassment patterns
  async analyzeForHarassment(content: string): Promise<{
    isHarassment: boolean;
    type: string;
    severity: string;
    patterns: string[];
    recommendations: string[];
  }> {
    const analysis = await this.analyzeMessage(content, 'harassment_check');
    
    const harassmentTypes = ['harassment', 'cyberbullying', 'sexual_harassment', 'stalking'];
    const detectedHarassment = analysis.detectedThreats.filter(threat => 
      harassmentTypes.some(type => threat.toLowerCase().includes(type.toLowerCase()))
    );

    const isHarassment = analysis.threatLevel >= 5 || detectedHarassment.length > 0;
    const type = detectedHarassment[0] || 'general';
    
    let severity = 'low';
    if (analysis.threatLevel >= 8) severity = 'critical';
    else if (analysis.threatLevel >= 6) severity = 'high';
    else if (analysis.threatLevel >= 4) severity = 'medium';

    const patterns = this.identifyHarassmentPatterns(content);
    const recommendations = this.getHarassmentRecommendations(type, severity);

    return {
      isHarassment,
      type,
      severity,
      patterns,
      recommendations
    };
  }

  // Analyze sentiment
  async analyzeSentiment(content: string): Promise<{
    sentiment: string;
    confidence: number;
    emotions: string[];
    intensity: number;
  }> {
    try {
      if (this.openai) {
        const prompt = `
Analyze the sentiment and emotional tone of this message:
"${content}"

Provide a JSON response with:
- sentiment (positive/neutral/negative/hostile)
- confidence (0-1)
- emotions (array of detected emotions like anger, fear, joy, etc.)
- intensity (0-10, emotional intensity level)
`;

        const response = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0.3,
        });

        const responseContent = response.choices[0]?.message?.content;
        if (responseContent) {
          try {
            return JSON.parse(responseContent);
          } catch {
            return this.fallbackSentimentAnalysis(content);
          }
        }
      }

      return this.fallbackSentimentAnalysis(content);
    } catch (error) {
      logger.error('Sentiment analysis error:', error);
      return this.fallbackSentimentAnalysis(content);
    }
  }

  // Generate safety advice
  async generateSafetyAdvice(situation: string, category: string, userContext: any): Promise<{
    recommendations: string[];
    immediateActions: string[];
    preventiveMeasures: string[];
    resources: string[];
    urgencyLevel: string;
  }> {
    try {
      if (this.openai) {
        const prompt = `
As a safety expert for women and girls in Kenya, provide comprehensive safety advice for this situation:

Situation: "${situation}"
Category: ${category}
User Location: ${userContext.location?.county || 'Kenya'}

Consider:
- Kenyan cultural context and laws
- Local resources and support systems
- Gender-specific safety concerns
- Digital safety practices
- Emergency procedures in Kenya

Provide a JSON response with:
- recommendations (general safety advice)
- immediateActions (urgent steps to take now)
- preventiveMeasures (future prevention strategies)
- resources (Kenya-specific helplines and services)
- urgencyLevel (low/medium/high/critical)

Focus on practical, actionable advice for Kenyan women.
`;

        const response = await this.openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
          temperature: 0.5,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          try {
            return JSON.parse(content);
          } catch {
            return this.generateFallbackSafetyAdvice(situation, category);
          }
        }
      }

      return this.generateFallbackSafetyAdvice(situation, category);
    } catch (error) {
      logger.error('Safety advice generation error:', error);
      return this.generateFallbackSafetyAdvice(situation, category);
    }
  }

  // Assess risk level
  async assessRisk(params: {
    factors: string[];
    location?: string;
    timeOfDay?: string;
    userProfile: any;
  }): Promise<{
    riskLevel: string;
    riskScore: number;
    primaryConcerns: string[];
    mitigationStrategies: string[];
    recommendedActions: string[];
    emergencyContactSuggestion: boolean;
  }> {
    let riskScore = 0;
    const primaryConcerns: string[] = [];
    const mitigationStrategies: string[] = [];
    const recommendedActions: string[] = [];

    // Analyze each risk factor
    for (const factor of params.factors) {
      const factorRisk = await this.analyzeSingleRiskFactor(factor, params);
      riskScore += factorRisk.score;
      if (factorRisk.concerns) {
        primaryConcerns.push(...factorRisk.concerns);
      }
    }

    // Time-based risk adjustments
    if (params.timeOfDay === 'night' || params.timeOfDay === 'late_night') {
      riskScore += 2;
      primaryConcerns.push('Increased vulnerability during nighttime hours');
    }

    // User profile adjustments
    if (params.userProfile.previousIncidents > 0) {
      riskScore += params.userProfile.previousIncidents;
      primaryConcerns.push('History of previous safety incidents');
    }

    if (params.userProfile.safetyScore < 70) {
      riskScore += 1;
      primaryConcerns.push('Current safety score indicates elevated risk');
    }

    // Determine risk level
    let riskLevel = 'low';
    if (riskScore >= 15) riskLevel = 'critical';
    else if (riskScore >= 10) riskLevel = 'high';
    else if (riskScore >= 5) riskLevel = 'medium';

    // Generate strategies and actions
    mitigationStrategies.push(...this.generateRiskMitigationStrategies(riskLevel, primaryConcerns));
    recommendedActions.push(...this.generateRiskActions(riskLevel, params));

    return {
      riskLevel,
      riskScore: Math.min(riskScore, 20), // Cap at 20
      primaryConcerns: [...new Set(primaryConcerns)], // Remove duplicates
      mitigationStrategies,
      recommendedActions,
      emergencyContactSuggestion: riskScore >= 8
    };
  }

  // Generate emergency response
  async generateEmergencyResponse(params: {
    emergencyType: string;
    location: string;
    immediateHelp: boolean;
    details?: string;
    userContext: any;
  }): Promise<{
    immediateActions: string[];
    emergencyContacts: any[];
    safetyInstructions: string[];
    localResources: any[];
    followUpSteps: string[];
    isUrgent: boolean;
  }> {
    const isUrgent = params.immediateHelp || 
      ['assault', 'domestic_violence', 'threats_of_violence'].includes(params.emergencyType);

    const immediateActions = this.getEmergencyImmediateActions(params.emergencyType, isUrgent);
    const emergencyContacts = this.getEmergencyContacts(params.location, params.emergencyType);
    const safetyInstructions = this.getEmergencySafetyInstructions(params.emergencyType);
    const localResources = this.getLocalResources(params.location, params.emergencyType);
    const followUpSteps = this.getEmergencyFollowUpSteps(params.emergencyType);

    return {
      immediateActions,
      emergencyContacts,
      safetyInstructions,
      localResources,
      followUpSteps,
      isUrgent
    };
  }

  // Fallback methods for when AI services are unavailable
  private fallbackMessageAnalysis(message: string, context: string) {
    const threatKeywords = [
      'kill', 'hurt', 'harm', 'die', 'death', 'threat', 'violence',
      'rape', 'assault', 'abuse', 'stalk', 'follow', 'watch',
      'bitch', 'whore', 'slut', 'stupid', 'ugly', 'hate'
    ];

    const harassmentKeywords = [
      'send photos', 'nude', 'naked', 'sexy', 'meet me', 'alone',
      'where do you live', 'home address', 'phone number'
    ];

    let threatLevel = 0;
    const detectedThreats: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Check for threat keywords
    threatKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        threatLevel += 2;
        if (!detectedThreats.includes('threats_of_violence')) {
          detectedThreats.push('threats_of_violence');
        }
      }
    });

    // Check for harassment keywords
    harassmentKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        threatLevel += 1;
        if (!detectedThreats.includes('harassment')) {
          detectedThreats.push('harassment');
        }
      }
    });

    // Check for repeated characters (could indicate aggressive typing)
    if (/(.)\1{3,}/.test(message)) {
      threatLevel += 1;
    }

    // Check for all caps (could indicate shouting/aggression)
    if (message === message.toUpperCase() && message.length > 10) {
      threatLevel += 1;
    }

    const recommendations = this.generateBasicRecommendations(threatLevel);
    const sentiment = threatLevel > 3 ? 'hostile' : threatLevel > 1 ? 'negative' : 'neutral';

    return {
      threatLevel: Math.min(threatLevel, 10),
      detectedThreats,
      confidence: 0.7,
      recommendations,
      sentiment
    };
  }

  private fallbackContentModeration(content: string) {
    const inappropriateTerms = [
      'explicit sexual content', 'hate speech', 'violence threats',
      'personal information sharing', 'harassment language'
    ];

    const flags: string[] = [];
    const categories: string[] = [];
    let isAppropriate = true;

    // Simple keyword-based moderation
    if (content.toLowerCase().includes('nude') || 
        content.toLowerCase().includes('naked') ||
        content.toLowerCase().includes('sex')) {
      flags.push('Potentially inappropriate sexual content');
      categories.push('sexual');
      isAppropriate = false;
    }

    return {
      isAppropriate,
      flags,
      categories,
      severity: isAppropriate ? 'low' : 'medium',
      suggestedAction: isAppropriate ? 'Content appears appropriate' : 'Content should be reviewed'
    };
  }

  private fallbackSentimentAnalysis(content: string) {
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'love', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'hate', 'angry', 'sad', 'awful'];
    const hostileWords = ['kill', 'die', 'threat', 'harm', 'violence'];

    const lowerContent = content.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    let hostileCount = 0;

    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) negativeCount++;
    });

    hostileWords.forEach(word => {
      if (lowerContent.includes(word)) hostileCount++;
    });

    let sentiment = 'neutral';
    if (hostileCount > 0) sentiment = 'hostile';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    else if (positiveCount > negativeCount) sentiment = 'positive';

    return {
      sentiment,
      confidence: 0.6,
      emotions: sentiment === 'hostile' ? ['anger', 'aggression'] : 
               sentiment === 'negative' ? ['sadness', 'frustration'] :
               sentiment === 'positive' ? ['joy', 'satisfaction'] : ['neutral'],
      intensity: hostileCount > 0 ? 8 : negativeCount > 0 ? 5 : positiveCount > 0 ? 4 : 2
    };
  }

  private generateBasicRecommendations(threatLevel: number): string[] {
    if (threatLevel >= 7) {
      return [
        'Document this message immediately',
        'Report to platform administrators',
        'Consider contacting local authorities',
        'Inform trusted contacts about this threat',
        'Review your privacy settings'
      ];
    } else if (threatLevel >= 4) {
      return [
        'Block the sender',
        'Save evidence of harassment',
        'Report to platform',
        'Consider limiting your online visibility'
      ];
    } else if (threatLevel >= 2) {
      return [
        'Monitor for escalating behavior',
        'Consider blocking if behavior continues',
        'Review your privacy settings'
      ];
    }

    return [
      'Continue monitoring interactions',
      'Report if behavior escalates'
    ];
  }

  private generateSuggestedActions(threatLevel: number, detectedThreats: string[]): string[] {
    const actions: string[] = [];

    if (threatLevel >= 8) {
      actions.push('Immediately document and report this threat');
      actions.push('Contact emergency services if in immediate danger');
      actions.push('Alert trusted contacts about the situation');
    }

    if (threatLevel >= 6) {
      actions.push('Block the sender immediately');
      actions.push('Report to platform administrators');
      actions.push('Save all evidence');
    }

    if (detectedThreats.includes('stalking')) {
      actions.push('Review and increase privacy settings');
      actions.push('Consider changing routine patterns');
    }

    if (detectedThreats.includes('sexual_harassment')) {
      actions.push('Report to appropriate authorities');
      actions.push('Seek support from trusted friends or family');
    }

    if (actions.length === 0) {
      actions.push('Monitor the situation');
      actions.push('Report if behavior escalates');
    }

    return actions;
  }

  private identifyHarassmentPatterns(content: string): string[] {
    const patterns: string[] = [];

    if (/(.)\1{3,}/.test(content)) {
      patterns.push('Aggressive repeated characters');
    }

    if (content === content.toUpperCase() && content.length > 10) {
      patterns.push('Excessive use of capital letters (shouting)');
    }

    if ((content.match(/!/g) || []).length > 3) {
      patterns.push('Excessive exclamation marks');
    }

    if (content.includes('you') && (content.includes('should') || content.includes('must'))) {
      patterns.push('Controlling language pattern');
    }

    return patterns;
  }

  private getHarassmentRecommendations(type: string, severity: string): string[] {
    const recommendations: string[] = [];

    switch (type) {
      case 'sexual_harassment':
        recommendations.push('Document all inappropriate messages');
        recommendations.push('Report to platform and consider legal action');
        recommendations.push('Seek support from trusted individuals');
        break;
      case 'cyberbullying':
        recommendations.push('Do not engage with the harasser');
        recommendations.push('Block and report the account');
        recommendations.push('Consider taking a break from the platform');
        break;
      case 'stalking':
        recommendations.push('Enhance privacy settings immediately');
        recommendations.push('Document all stalking behavior');
        recommendations.push('Consider contacting authorities');
        break;
      default:
        recommendations.push('Block the harasser');
        recommendations.push('Report the behavior');
        recommendations.push('Seek support if needed');
    }

    if (severity === 'critical' || severity === 'high') {
      recommendations.push('Consider contacting local authorities');
      recommendations.push('Alert trusted contacts about the situation');
    }

    return recommendations;
  }

  private generateFallbackSafetyAdvice(situation: string, category: string) {
    const kenyanResources = [
      'National Gender and Equality Commission: 0800 720 501',
      'Gender Violence Recovery Centre: +254 709 991 000',
      'Kenya Police Emergency: 911 or 999',
      'Childline Kenya: 116'
    ];

    let urgencyLevel = 'medium';
    const recommendations: string[] = [];
    const immediateActions: string[] = [];
    const preventiveMeasures: string[] = [];

    if (category === 'harassment' || category === 'stalking') {
      urgencyLevel = 'high';
      immediateActions.push('Document all evidence immediately');
      immediateActions.push('Report to relevant authorities');
      recommendations.push('Block all contact with the harasser');
      recommendations.push('Inform trusted contacts about the situation');
      preventiveMeasures.push('Review and enhance privacy settings');
      preventiveMeasures.push('Consider changing routine patterns');
    }

    if (category === 'dating') {
      recommendations.push('Always meet in public places');
      recommendations.push('Tell someone about your plans');
      recommendations.push('Trust your instincts');
      preventiveMeasures.push('Video call before meeting in person');
      preventiveMeasures.push('Use your own transportation');
    }

    return {
      recommendations,
      immediateActions,
      preventiveMeasures,
      resources: kenyanResources,
      urgencyLevel
    };
  }

  private async analyzeSingleRiskFactor(factor: string, params: any): Promise<{score: number; concerns: string[]}> {
    const concerns: string[] = [];
    let score = 0;

    // Analyze factor content for risk indicators
    const lowerFactor = factor.toLowerCase();
    
    if (lowerFactor.includes('threat') || lowerFactor.includes('violence')) {
      score += 5;
      concerns.push('Threats of violence detected');
    }

    if (lowerFactor.includes('follow') || lowerFactor.includes('stalk')) {
      score += 4;
      concerns.push('Stalking behavior indicated');
    }

    if (lowerFactor.includes('alone') || lowerFactor.includes('isolated')) {
      score += 2;
      concerns.push('Isolation or vulnerability factors');
    }

    if (lowerFactor.includes('drunk') || lowerFactor.includes('intoxicated')) {
      score += 3;
      concerns.push('Impaired judgment situation');
    }

    return { score, concerns };
  }

  private generateRiskMitigationStrategies(riskLevel: string, concerns: string[]): string[] {
    const strategies: string[] = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      strategies.push('Avoid being alone in vulnerable situations');
      strategies.push('Maintain constant communication with trusted contacts');
      strategies.push('Have emergency contacts readily available');
    }

    if (concerns.some(c => c.includes('stalking'))) {
      strategies.push('Vary your routine and routes');
      strategies.push('Enhance home and personal security');
    }

    if (concerns.some(c => c.includes('violence'))) {
      strategies.push('Consider personal safety devices');
      strategies.push('Learn basic self-defense techniques');
    }

    strategies.push('Trust your instincts and intuition');
    strategies.push('Stay aware of your surroundings');

    return strategies;
  }

  private generateRiskActions(riskLevel: string, params: any): string[] {
    const actions: string[] = [];

    if (riskLevel === 'critical') {
      actions.push('Contact emergency services immediately');
      actions.push('Move to a safe location');
      actions.push('Alert emergency contacts');
    } else if (riskLevel === 'high') {
      actions.push('Reach out to trusted contacts');
      actions.push('Consider changing your location');
      actions.push('Review safety protocols');
    }

    if (params.timeOfDay === 'night' || params.timeOfDay === 'late_night') {
      actions.push('Ensure adequate lighting and visibility');
      actions.push('Use reliable transportation');
    }

    actions.push('Document any concerning incidents');
    actions.push('Review and update safety plans');

    return actions;
  }

  private getEmergencyImmediateActions(emergencyType: string, isUrgent: boolean): string[] {
    const actions: string[] = [];

    if (isUrgent) {
      actions.push('Call 911 or 999 immediately');
      actions.push('Move to a safe location if possible');
    }

    switch (emergencyType) {
      case 'assault':
      case 'domestic_violence':
        actions.push('Get to safety immediately');
        actions.push('Call Kenya Police: 911 or 999');
        actions.push('Seek medical attention if injured');
        actions.push('Contact a trusted person');
        break;
      case 'stalking':
        actions.push('Document all stalking incidents');
        actions.push('Report to police');
        actions.push('Inform trusted contacts');
        actions.push('Vary your routines');
        break;
      case 'harassment':
      case 'cyberbullying':
        actions.push('Block all contact with harasser');
        actions.push('Save all evidence');
        actions.push('Report to platform/authorities');
        actions.push('Seek support from friends/family');
        break;
      default:
        actions.push('Assess immediate safety');
        actions.push('Contact appropriate authorities');
        actions.push('Reach out for support');
    }

    return actions;
  }

  private getEmergencyContacts(location: string, emergencyType: string): any[] {
    const contacts = [
      {
        name: 'Kenya Police Emergency',
        number: '911',
        description: 'For immediate police assistance'
      },
      {
        name: 'Kenya Police Emergency (Alternative)',
        number: '999',
        description: 'Alternative police emergency line'
      }
    ];

    // Add specific contacts based on emergency type
    if (['assault', 'domestic_violence', 'sexual_harassment'].includes(emergencyType)) {
      contacts.push(
        {
          name: 'Gender Violence Recovery Centre',
          number: '+254 709 991 000',
          description: 'Specialized support for gender-based violence'
        },
        {
          name: 'National Gender and Equality Commission',
          number: '0800 720 501',
          description: 'Gender equality and rights support'
        }
      );
    }

    if (emergencyType === 'harassment' || emergencyType === 'cyberbullying') {
      contacts.push({
        name: 'Kenya ICT Action Network (KICTANet)',
        number: '+254 20 2650197',
        description: 'Digital rights and online safety support'
      });
    }

    return contacts;
  }

  private getEmergencySafetyInstructions(emergencyType: string): string[] {
    const instructions = ['Stay calm and assess your immediate safety'];

    switch (emergencyType) {
      case 'assault':
        instructions.push('Get to a public place with people around');
        instructions.push('Do not go home if you think you were followed');
        instructions.push('Seek medical attention even if injuries seem minor');
        break;
      case 'domestic_violence':
        instructions.push('Leave safely when the abuser is not present');
        instructions.push('Go to a safe location (friend, family, shelter)');
        instructions.push('Take important documents if possible');
        break;
      case 'stalking':
        instructions.push('Do not confront the stalker directly');
        instructions.push('Keep detailed records of all incidents');
        instructions.push('Vary your daily routines and routes');
        break;
      case 'cyberbullying':
      case 'harassment':
        instructions.push('Do not respond to or engage with the harasser');
        instructions.push('Take screenshots of all evidence');
        instructions.push('Report to the platform immediately');
        break;
    }

    instructions.push('Trust your instincts about danger');
    instructions.push('Keep emergency contacts easily accessible');

    return instructions;
  }

  private getLocalResources(location: string, emergencyType: string): any[] {
    const resources = [
      {
        name: 'Coalition on Violence Against Women (COVAW)',
        location: 'Nairobi',
        contact: '+254 20 3000061',
        services: ['Counseling', 'Legal aid', 'Safe shelter'],
        description: 'Comprehensive support for women facing violence'
      },
      {
        name: 'Usikimye',
        location: 'Nationwide',
        contact: 'info@usikimye.or.ke',
        services: ['Online reporting', 'Support network', 'Awareness'],
        description: 'Platform for reporting and addressing sexual violence'
      }
    ];

    // Add location-specific resources
    if (location?.toLowerCase().includes('nairobi')) {
      resources.push({
        name: 'Nairobi Women\'s Hospital',
        location: 'Nairobi',
        contact: '+254 20 2845000',
        services: ['Medical care', 'Counseling', 'Legal support'],
        description: 'Comprehensive healthcare for women'
      });
    }

    return resources;
  }

  private getEmergencyFollowUpSteps(emergencyType: string): string[] {
    const steps = [
      'Follow up with authorities on any reports made',
      'Seek ongoing support from counselors or support groups',
      'Review and update safety plans regularly'
    ];

    switch (emergencyType) {
      case 'assault':
      case 'domestic_violence':
        steps.push('Consider obtaining a restraining order');
        steps.push('Connect with legal aid services');
        steps.push('Access trauma counseling services');
        break;
      case 'stalking':
        steps.push('Continue documenting incidents');
        steps.push('Consider security assessments for home/work');
        steps.push('Join stalking survivor support groups');
        break;
      case 'harassment':
      case 'cyberbullying':
        steps.push('Monitor for escalation of behavior');
        steps.push('Consider digital security training');
        steps.push('Connect with online safety resources');
        break;
    }

    return steps;
  }
}
