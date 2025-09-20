import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export interface HealthAnalysis {
  diseaseDetection: {
    possibleConditions: string[]
    severity: "low" | "medium" | "high"
    confidence: number
    recommendations: string[]
  }
  symptoms: {
    identified: string[]
    category: string
    urgency: "routine" | "urgent" | "emergency"
  }
  medications: {
    interactions: string[]
    recommendations: string[]
    warnings: string[]
  }
  nextSteps: {
    immediateActions: string[]
    followUpCare: string[]
    preventiveMeasures: string[]
  }
}

export async function analyzeHealthDocument(
  documentText: string,
  documentType: string,
  patientSymptoms?: string,
  currentMedications?: string,
): Promise<HealthAnalysis> {
  try {
    const prompt = `
You are a medical AI assistant helping to analyze health documents for migrant workers in Kerala, India. 
Analyze the following health information and provide insights:

Document Type: ${documentType}
Document Content: ${documentText}
${patientSymptoms ? `Patient Symptoms: ${patientSymptoms}` : ""}
${currentMedications ? `Current Medications: ${currentMedications}` : ""}

Please provide a comprehensive analysis in the following JSON format:
{
  "diseaseDetection": {
    "possibleConditions": ["condition1", "condition2"],
    "severity": "low|medium|high",
    "confidence": 0.0-1.0,
    "recommendations": ["recommendation1", "recommendation2"]
  },
  "symptoms": {
    "identified": ["symptom1", "symptom2"],
    "category": "respiratory|cardiovascular|digestive|neurological|other",
    "urgency": "routine|urgent|emergency"
  },
  "medications": {
    "interactions": ["interaction1"],
    "recommendations": ["med_recommendation1"],
    "warnings": ["warning1"]
  },
  "nextSteps": {
    "immediateActions": ["action1", "action2"],
    "followUpCare": ["followup1", "followup2"],
    "preventiveMeasures": ["prevention1", "prevention2"]
  }
}

Focus on:
1. Common diseases prevalent in Kerala (dengue, chikungunya, malaria, typhoid, hepatitis)
2. Occupational health risks for migrant workers
3. Preventive care recommendations
4. When to seek immediate medical attention
5. Cultural and language considerations for Kerala

Provide practical, actionable advice suitable for migrant workers.
`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      temperature: 0.3,
    })

    // Parse the JSON response
    const analysis = JSON.parse(text) as HealthAnalysis
    return analysis
  } catch (error) {
    console.error("Error analyzing health document:", error)

    // Return a fallback analysis
    return {
      diseaseDetection: {
        possibleConditions: ["Unable to analyze - please consult a healthcare provider"],
        severity: "medium",
        confidence: 0.1,
        recommendations: ["Consult with a qualified healthcare provider for proper diagnosis"],
      },
      symptoms: {
        identified: ["Analysis unavailable"],
        category: "other",
        urgency: "routine",
      },
      medications: {
        interactions: [],
        recommendations: ["Consult pharmacist or doctor before taking any medications"],
        warnings: ["Always inform healthcare providers about all medications you are taking"],
      },
      nextSteps: {
        immediateActions: ["Seek medical consultation"],
        followUpCare: ["Regular health checkups"],
        preventiveMeasures: ["Maintain good hygiene", "Stay hydrated", "Get adequate rest"],
      },
    }
  }
}

export async function generateHealthAdvice(symptoms: string, location = "Kerala"): Promise<string> {
  try {
    const prompt = `
You are a healthcare AI assistant providing advice to migrant workers in ${location}, India.
A worker is experiencing these symptoms: ${symptoms}

Provide helpful, practical health advice including:
1. Possible causes (focus on common conditions in ${location})
2. Home care recommendations
3. When to seek medical help
4. Preventive measures
5. Local healthcare resources if available

Keep the advice:
- Simple and easy to understand
- Culturally appropriate for migrant workers
- Focused on practical steps
- Clear about when professional medical help is needed

Provide the response in a clear, structured format.
`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      temperature: 0.4,
    })

    return text
  } catch (error) {
    console.error("Error generating health advice:", error)
    return "I'm unable to provide specific medical advice right now. Please consult with a qualified healthcare provider for proper guidance on your symptoms."
  }
}

export async function findNearbyHealthcare(
  location: string,
  serviceType: "hospital" | "clinic" | "pharmacy" | "emergency" = "hospital",
): Promise<
  {
    name: string
    address: string
    phone?: string
    distance?: string
    services: string[]
  }[]
> {
  // In a real implementation, this would integrate with Google Maps API or similar
  // For now, return mock data for Kerala
  const mockHealthcareProviders = [
    {
      name: "Government General Hospital",
      address: "MG Road, Thiruvananthapuram, Kerala",
      phone: "+91 471 2443870",
      distance: "2.5 km",
      services: ["Emergency Care", "General Medicine", "Surgery", "Outpatient Services"],
    },
    {
      name: "Medical College Hospital",
      address: "Medical College, Thiruvananthapuram, Kerala",
      phone: "+91 471 2524266",
      distance: "3.2 km",
      services: ["Specialized Care", "Emergency", "Diagnostics", "Surgery"],
    },
    {
      name: "Community Health Center",
      address: "Pattom, Thiruvananthapuram, Kerala",
      phone: "+91 471 2447890",
      distance: "1.8 km",
      services: ["Primary Care", "Vaccination", "Basic Diagnostics", "Maternal Care"],
    },
  ]

  return mockHealthcareProviders.filter((provider) =>
    serviceType === "hospital" ? provider.services.includes("Emergency Care") : true,
  )
}
