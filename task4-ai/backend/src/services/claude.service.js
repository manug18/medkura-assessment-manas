import Anthropic from "@anthropic-ai/sdk";

let client;

const SYSTEM_PROMPT = `You are a clinical assistant at MedKura Health.
You will receive a patient's medical report or discharge summary.
Extract and return ONLY valid JSON in this exact structure:
{
  "keyFindings": "A concise summary of the main clinical findings and diagnosis (2-3 sentences). Use plain language a non-medical person can understand.",
  "currentMedications": ["List of medications currently prescribed", "Include dosage if available"],
  "redFlags": ["List of urgent concerns or red flags that need immediate attention", "Include any critical values or warning signs"],
  "patientQuery": "What is the patient's main question or the second opinion they are seeking?",
  "suggestedSpecialist": "The recommended specialist type based on the diagnosis and concerns (e.g., 'Cardiologist', 'Orthopedic Surgeon', etc.)"
}

Rules:
- Be concise and clear
- Use plain language a non-medical person can understand
- If a field is not mentioned in the report, set it to null
- Return ONLY valid JSON, no extra text
- Medications array should be empty [] if none are listed
- Red flags array should be empty [] if none are identified`;

export async function summarizeMedicalReport(reportText) {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error("CLAUDE_API_KEY environment variable is not set");
  }

  if (!client) {
    // delay instantiation until first use, after dotenv has run
    client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  if (!reportText || reportText.trim().length === 0) {
    throw new Error("Medical report text cannot be empty");
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6", // using latest supported Claude 3 model
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please analyze this medical report and extract the required information:\n\n${reportText}`,
        },
      ],
    });

    // Extract the text content from the response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Claude response");
    }

    const summary = JSON.parse(jsonMatch[0]);

    // Validate the structure
    validateSummaryStructure(summary);

    return summary;
  } catch (error) {
    if (error.message.includes("401")) {
      throw new Error("Invalid Claude API key");
    }
    if (error.message.includes("overloaded")) {
      throw new Error("Claude API is currently overloaded. Please try again.");
    }
    throw error;
  }
}

function validateSummaryStructure(summary) {
  const requiredFields = [
    "keyFindings",
    "currentMedications",
    "redFlags",
    "patientQuery",
    "suggestedSpecialist",
  ];

  for (const field of requiredFields) {
    if (!(field in summary)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (
    summary.currentMedications &&
    !Array.isArray(summary.currentMedications)
  ) {
    throw new Error("currentMedications must be an array");
  }

  if (summary.redFlags && !Array.isArray(summary.redFlags)) {
    throw new Error("redFlags must be an array");
  }
}
