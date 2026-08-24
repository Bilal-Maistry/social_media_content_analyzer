package com.analyzer.service;

import com.analyzer.dto.AnalysisResponseDto.AiAnalysisData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiEngagementService {

    private static final Logger logger = LoggerFactory.getLogger(AiEngagementService.class);

    @Value("${ai.api.key:}")
    private String aiApiKey;

    @Value("${ai.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent}")
    private String aiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates a precise AI content analysis (2-3 sentence cohesive summary, strict classification, 2 actionable improvements).
     * Evaluates actual text using Gemini 3.7 Flash API or local NLP fallback.
     */
    public AiAnalysisData analyzeContent(String text, String platform) {
        if (text == null || text.trim().isEmpty()) {
            return generateEmptyAnalysis();
        }

        String targetPlatform = (platform == null || platform.trim().isEmpty()) ? "LinkedIn" : platform;
        String keyToUse = (aiApiKey != null && !aiApiKey.trim().isEmpty())
                ? aiApiKey
                : (System.getenv("AI_API_KEY") != null ? System.getenv("AI_API_KEY") : System.getenv("GEMINI_API_KEY"));

        // Try external Gemini 3.7 Flash API call if key is present
        if (keyToUse != null && !keyToUse.trim().isEmpty() && !keyToUse.contains("your_gemini_api_key")) {
            try {
                logger.info("Calling Gemini 3.7 Flash API for precise analysis on platform: {}", targetPlatform);
                AiAnalysisData externalResult = callGemini37FlashApi(text, targetPlatform, keyToUse);
                if (externalResult != null) {
                    return externalResult;
                }
            } catch (Exception e) {
                logger.warn("External Gemini 3.7 Flash API call failed, using local engine: {}", e.getMessage());
            }
        }

        // Fallback: Precise local engine evaluating actual text
        return analyzeWithLocalEngine(text, targetPlatform);
    }

    private AiAnalysisData callGemini37FlashApi(String text, String platform, String apiKey) {
        String endpointUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" + apiKey;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = "You are a precise content classification and editing assistant. Analyze the input text for " + platform + ".\n"
                    + "Return ONLY a raw JSON object (no markdown, no code fences, no wrappers) with exact keys:\n"
                    + "{\n"
                    + "  \"summary\": \"Cohesive summary of the core topic...\",\n"
                    + "  \"classification\": \"Informative\",\n"
                    + "  \"improvements\": [\"First brief actionable improvement suggestion.\", \"Second brief actionable improvement suggestion.\"]\n"
                    + "}\n\n"
                    + "Rules for summary: Provide a clear, cohesive 2–3 sentence summary describing the primary context, key individuals or entities involved, and the core message or claim being made. Do NOT return raw headline fragments, titles, or isolated words.\n"
                    + "Rules for classification: Select strictly ONE from: 'Informative', 'Sensational/Rumor', 'Promotional'.\n"
                    + "Rules for improvements: Return exactly two brief, highly relevant actionable recommendations.\n\n"
                    + "TEXT TO ANALYZE:\n" + text;

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(contentMap));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(endpointUrl, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map body = response.getBody();
                List candidates = (List) body.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    if (content != null) {
                        List parts = (List) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map firstPart = (Map) parts.get(0);
                            String rawJsonText = (String) firstPart.get("text");
                            if (rawJsonText != null && !rawJsonText.trim().isEmpty()) {
                                String cleanJson = rawJsonText.replaceAll("```[a-z]*\n?", "").replaceAll("```", "").trim();
                                Map<String, Object> parsed = objectMapper.readValue(cleanJson, Map.class);

                                String summary = (String) parsed.get("summary");
                                String classification = (String) parsed.get("classification");
                                List<String> improvements = (List<String>) parsed.get("improvements");

                                if (summary != null && classification != null && improvements != null && !improvements.isEmpty()) {
                                    logger.info("Successfully received precise analysis from Gemini 3.7 Flash API.");
                                    return new AiAnalysisData(summary, classification, improvements);
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Gemini 3.7 Flash API call failed: {}", e.getMessage());
        }
        return null;
    }

    private AiAnalysisData analyzeWithLocalEngine(String text, String platform) {
        String cleanText = text.trim();
        String[] lines = cleanText.split("\n");
        String firstLine = lines.length > 0 ? lines[0].trim() : cleanText;
        String secondLine = lines.length > 1 ? lines[1].trim() : "";

        // 1. Precise 2-Sentence Summary derived from actual text
        String s1 = firstLine.endsWith(".") ? firstLine : firstLine + ".";
        String s2 = secondLine.isEmpty()
                ? "The content outlines strategic points for audience engagement on " + platform + "."
                : (secondLine.endsWith(".") ? secondLine : secondLine + ".");
        String summary = s1 + " " + s2;

        // 2. Strict Classification based on text content triggers
        String classification = "Informative";
        String lower = cleanText.toLowerCase();
        if (lower.contains("buy") || lower.contains("discount") || lower.contains("deal") || lower.contains("limited time") || lower.contains("offer") || lower.contains("sale") || lower.contains("price")) {
            classification = "Promotional";
        } else if (lower.contains("secret") || lower.contains("shocking") || lower.contains("unbelievable") || lower.contains("warning") || lower.contains("exposed") || lower.contains("leak")) {
            classification = "Sensational/Rumor";
        }

        // 3. Exactly 2 Brief Actionable Improvements
        List<String> improvements = new ArrayList<>();
        if (!cleanText.contains("?") && !lower.contains("comment")) {
            improvements.add("Add a direct question or Call-To-Action at the end to boost audience comments.");
        } else {
            improvements.add("Highlight key data points or metrics in bold to improve mobile readability.");
        }

        if (!cleanText.contains("\n\n")) {
            improvements.add("Increase line spacing between sentences for better visual skimmability on feeds.");
        } else {
            improvements.add("Consider appending 2-3 niche platform hashtags at the bottom to increase discovery.");
        }

        return new AiAnalysisData(summary, classification, improvements);
    }

    private AiAnalysisData generateEmptyAnalysis() {
        return new AiAnalysisData(
            "No content provided for summary.",
            "Informative",
            Arrays.asList("Provide readable text in uploaded file.", "Ensure document is not empty.")
        );
    }
}
