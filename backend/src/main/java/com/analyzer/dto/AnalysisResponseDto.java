package com.analyzer.dto;

import java.util.List;

public class AnalysisResponseDto {

    private String fileName;
    private String fileType;
    private String fileSize;
    private String extractedText;
    private int wordCount;
    private int characterCount;
    private String extractionMethod;
    private String platform;
    private AiAnalysisData aiAnalysis;

    public AnalysisResponseDto() {}

    public AnalysisResponseDto(String fileName, String fileType, String fileSize, String extractedText,
                               int wordCount, int characterCount, String extractionMethod,
                               String platform, AiAnalysisData aiAnalysis) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.extractedText = extractedText;
        this.wordCount = wordCount;
        this.characterCount = characterCount;
        this.extractionMethod = extractionMethod;
        this.platform = platform;
        this.aiAnalysis = aiAnalysis;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public int getWordCount() { return wordCount; }
    public void setWordCount(int wordCount) { this.wordCount = wordCount; }

    public int getCharacterCount() { return characterCount; }
    public void setCharacterCount(int characterCount) { this.characterCount = characterCount; }

    public String getExtractionMethod() { return extractionMethod; }
    public void setExtractionMethod(String extractionMethod) { this.extractionMethod = extractionMethod; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public AiAnalysisData getAiAnalysis() { return aiAnalysis; }
    public void setAiAnalysis(AiAnalysisData aiAnalysis) { this.aiAnalysis = aiAnalysis; }

    // --- Minimalist Data Model ---

    public static class AiAnalysisData {
        private String summary;
        private String classification;
        private List<String> improvements;

        public AiAnalysisData() {}

        public AiAnalysisData(String summary, String classification, List<String> improvements) {
            this.summary = summary;
            this.classification = classification;
            this.improvements = improvements;
        }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public String getClassification() { return classification; }
        public void setClassification(String classification) { this.classification = classification; }

        public List<String> getImprovements() { return improvements; }
        public void setImprovements(List<String> improvements) { this.improvements = improvements; }
    }
}
