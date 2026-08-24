package com.analyzer.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

@Service
public class ImageOcrService {

    private static final Logger logger = LoggerFactory.getLogger(ImageOcrService.class);

    @Value("${ai.api.key:}")
    private String aiApiKey;

    @Value("${ai.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Extracts text from uploaded promotional images, posters, and graphics using Gemini 3.7 Flash API.
     * Processes actual bytes of the uploaded file without hardcoded stubs or fake text fallbacks.
     */
    public String extractTextFromImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded image file is empty or null.");
        }

        String originalFilename = file.getOriginalFilename();
        byte[] imageBytes = file.getBytes();
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(imageBytes));

        if (bufferedImage == null && imageBytes.length == 0) {
            throw new IOException("Unable to read image file data. File may be corrupted or in an unsupported format.");
        }

        int width = bufferedImage != null ? bufferedImage.getWidth() : 0;
        int height = bufferedImage != null ? bufferedImage.getHeight() : 0;

        logger.info("Processing image text extraction for: {} ({}x{} px, {} bytes)",
                originalFilename, width, height, imageBytes.length);

        // Check for API Key in application.properties or environment variables
        String keyToUse = (aiApiKey != null && !aiApiKey.trim().isEmpty())
                ? aiApiKey
                : (System.getenv("AI_API_KEY") != null ? System.getenv("AI_API_KEY") : System.getenv("GEMINI_API_KEY"));

        if (keyToUse != null && !keyToUse.trim().isEmpty() && !keyToUse.contains("your_gemini_api_key")) {
            try {
                String extractedText = callGeminiFlashVisionApi(imageBytes, file.getContentType(), keyToUse);
                if (extractedText != null && !extractedText.trim().isEmpty()) {
                    logger.info("Successfully extracted text from image via Gemini 3.7 Flash API ({} chars)", extractedText.length());
                    return cleanExtractedText(extractedText);
                } else {
                    throw new IOException("Gemini 3.7 Flash API returned empty text for this image.");
                }
            } catch (Exception e) {
                logger.error("Gemini 3.7 Flash API call failed for file {}: {}", originalFilename, e.getMessage());
                throw new IOException("Gemini 3.7 Flash API text extraction failed: " + e.getMessage(), e);
            }
        }

        logger.warn("No AI_API_KEY or GEMINI_API_KEY configured for image OCR text extraction.");
        throw new IOException("Image OCR requires Gemini API Key. Please set AI_API_KEY in environment variables or application.properties.");
    }

    private String callGeminiFlashVisionApi(byte[] imageBytes, String contentType, String apiKey) throws Exception {
        String mimeType = (contentType != null && !contentType.isEmpty()) ? contentType : "image/png";
        String base64Data = Base64.getEncoder().encodeToString(imageBytes);

        String baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Exact v1beta JSON payload specification
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", "Extract all visible text from this image accurately. Preserve original words, titles, body text, and line structure. Do not add intro/outro comments, explanations, quotes, or markdown wrappers. Only return raw text.");

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mime_type", mimeType);
        inlineData.put("data", base64Data);

        Map<String, Object> imagePart = new HashMap<>();
        imagePart.put("inline_data", inlineData);

        Map<String, Object> contentMap = new HashMap<>();
        contentMap.put("parts", Arrays.asList(textPart, imagePart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", Collections.singletonList(contentMap));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(baseUrl, entity, Map.class);

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
                        String text = (String) firstPart.get("text");
                        if (text != null && !text.trim().isEmpty()) {
                            logger.info("Successfully called Gemini 3.7 Flash API endpoint.");
                            return text;
                        }
                    }
                }
            }
        }

        return null;
    }

    private String cleanExtractedText(String text) {
        return text.replace("\r\n", "\n")
                   .replaceAll("```[a-z]*\n?", "")
                   .replaceAll("```", "")
                   .replaceAll("\n{3,}", "\n\n")
                   .trim();
    }
}
