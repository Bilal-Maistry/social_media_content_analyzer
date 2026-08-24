package com.analyzer.controller;

import com.analyzer.dto.AnalysisResponseDto;
import com.analyzer.dto.AnalysisResponseDto.AiAnalysisData;
import com.analyzer.service.AiEngagementService;
import com.analyzer.service.ImageOcrService;
import com.analyzer.service.PdfExtractionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContentAnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(ContentAnalysisController.class);

    private final PdfExtractionService pdfExtractionService;
    private final ImageOcrService imageOcrService;
    private final AiEngagementService aiEngagementService;

    @Autowired
    public ContentAnalysisController(PdfExtractionService pdfExtractionService,
                                     ImageOcrService imageOcrService,
                                     AiEngagementService aiEngagementService) {
        this.pdfExtractionService = pdfExtractionService;
        this.imageOcrService = imageOcrService;
        this.aiEngagementService = aiEngagementService;
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Social Media Content Analyzer REST API");
        return ResponseEntity.ok(status);
    }

    /**
     * Accepts multipart upload of PDF or Image files, extracts text, and generates AI suggestions.
     */
    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeContent(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "platform", required = false, defaultValue = "LinkedIn") String platform) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(createErrorResponse("File is empty. Please upload a valid PDF or Image file."));
        }

        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        long sizeBytes = file.getSize();
        String formattedSize = formatFileSize(sizeBytes);

        logger.info("Received file for analysis: {} ({}, {}) for platform: {}", originalFilename, contentType, formattedSize, platform);

        String extractedText;
        String extractionMethod;
        String fileType;

        try {
            if (isPdfFile(originalFilename, contentType)) {
                fileType = "PDF";
                extractionMethod = "Apache PDFBox 3.0";
                extractedText = pdfExtractionService.extractText(file);
            } else if (isImageFile(originalFilename, contentType)) {
                fileType = "IMAGE";
                extractionMethod = "Gemini Flash Vision API";
                extractedText = imageOcrService.extractTextFromImage(file);
            } else {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                        .body(createErrorResponse("Unsupported file type. Please upload a PDF document or image file (PNG, JPG, WEBP, BMP)."));
            }

            int wordCount = countWords(extractedText);
            int characterCount = extractedText.length();

            // Run AI Engagement Analysis
            AiAnalysisData aiAnalysis = aiEngagementService.analyzeContent(extractedText, platform);

            AnalysisResponseDto response = new AnalysisResponseDto(
                    originalFilename,
                    fileType,
                    formattedSize,
                    extractedText,
                    wordCount,
                    characterCount,
                    extractionMethod,
                    platform,
                    aiAnalysis
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            logger.error("Error processing uploaded file: {}", originalFilename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to extract content from file: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during content analysis", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An internal server error occurred while analyzing the document."));
        }
    }

    private boolean isPdfFile(String filename, String contentType) {
        if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
            return true;
        }
        return filename != null && filename.toLowerCase().endsWith(".pdf");
    }

    private boolean isImageFile(String filename, String contentType) {
        if (contentType != null && contentType.startsWith("image/")) {
            return true;
        }
        if (filename != null) {
            String lower = filename.toLowerCase();
            return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg")
                    || lower.endsWith(".webp") || lower.endsWith(".bmp") || lower.endsWith(".tiff")
                    || lower.endsWith(".gif");
        }
        return false;
    }

    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) return 0;
        return text.trim().split("\\s+").length;
    }

    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        char pre = "KMGTPE".charAt(exp - 1);
        return String.format("%.1f %cB", bytes / Math.pow(1024, exp), pre);
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
