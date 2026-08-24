package com.analyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(PdfExtractionService.class);

    /**
     * Extracts text from a PDF file while preserving spatial layout, paragraph structure, and formatting.
     * Uses Apache PDFBox 3.0 stripper configured with positional sorting.
     */
    public String extractText(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded PDF file is empty or null.");
        }

        byte[] bytes = file.getBytes();
        logger.info("Parsing PDF document: {} ({} bytes)", file.getOriginalFilename(), bytes.length);

        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            
            // Sort by positional placement on page to maintain logical line breaks and columns
            stripper.setSortByPosition(true);
            stripper.setAddMoreFormatting(true);

            String extracted = stripper.getText(document);
            if (extracted == null || extracted.trim().isEmpty()) {
                logger.warn("PDF contains no selectable text stream (may be scanned image PDF).");
                return "[Note: PDF contains no readable text layer. It may be an image-only scanned document.]";
            }

            return cleanExtractedText(extracted);
        } catch (Exception e) {
            logger.error("Error extracting text from PDF", e);
            throw new IOException("Failed to parse PDF document: " + e.getMessage(), e);
        }
    }

    private String cleanExtractedText(String text) {
        // Standardize line endings and clean excessive blank lines while preserving paragraph spacing
        return text.replace("\r\n", "\n")
                   .replace("\r", "\n")
                   .replaceAll("\n{3,}", "\n\n")
                   .trim();
    }
}
