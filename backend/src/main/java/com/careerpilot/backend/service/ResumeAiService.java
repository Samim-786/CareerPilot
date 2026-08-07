package com.careerpilot.backend.service;

import com.careerpilot.backend.ai.RagService;
import com.careerpilot.backend.entity.Resume;
import com.careerpilot.backend.repository.ResumeRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAiService {

        private final ResumeRepository resumeRepository;
        private final UserRepository userRepository;
        private final RagService ragService;
        private final ChatClient.Builder chatClientBuilder;

        private com.careerpilot.backend.entity.User getCurrentUser() {
                String email = SecurityContextHolder.getContext()
                                .getAuthentication().getName();
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        public Resume uploadResume(MultipartFile file) throws IOException {
                var user = getCurrentUser();

                // Extract text based on file type
                String extractedText;
                String fileName = file.getOriginalFilename();

                if (fileName != null && fileName.endsWith(".pdf")) {
                        // Extract text from PDF
                        try (org.apache.pdfbox.pdmodel.PDDocument document = org.apache.pdfbox.Loader
                                        .loadPDF(file.getBytes())) {
                                org.apache.pdfbox.text.PDFTextStripper stripper = new org.apache.pdfbox.text.PDFTextStripper();
                                extractedText = stripper.getText(document);
                        }
                } else {
                        // Plain text file
                        extractedText = new String(file.getBytes());
                }

                // Store in vector DB for RAG
                ragService.storeDocuments(extractedText, Map.of(
                                "userId", user.getEmail(),
                                "type", "resume",
                                "fileName", file.getOriginalFilename()));

                // Ask AI to extract skills
                String skillsPrompt = """
                                Extract only the technical skills from this resume text.
                                Return them as a comma separated list. Nothing else.

                                Resume:
                                %s
                                """.formatted(extractedText);

                String skillsRaw = chatClientBuilder.build()
                                .prompt()
                                .user(skillsPrompt)
                                .call()
                                .content();

                String[] skills = java.util.Arrays.stream(skillsRaw.split(","))
                                .map(String::trim)
                                .map(s -> s.replaceAll("[.]+$", ""))
                                .filter(s -> !s.isBlank())
                                .distinct()
                                .toArray(String[]::new);

                // Save resume to DB
                Resume resume = Resume.builder()
                                .user(user)
                                .fileName(fileName)
                                .extractedText(extractedText)
                                .skills(skills)
                                .build();

                return resumeRepository.save(resume);
        }

        public String analyzeResume(Long resumeId) {
                Resume resume = resumeRepository.findByIdAndUserId(
                                resumeId,
                                getCurrentUser().getId()).orElseThrow(() -> new RuntimeException("Resume not found"));

                String prompt = """
                                Analyze this resume and provide:
                                1. Top 3 strengths
                                2. Top 3 areas to improve
                                3. Overall score out of 10
                                4. One line summary

                                Resume:
                                %s
                                """.formatted(resume.getExtractedText());

                return chatClientBuilder.build()
                                .prompt()
                                .user(prompt)
                                .call()
                                .content();
        }
}