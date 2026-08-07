package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.Resume;
import com.careerpilot.backend.service.ResumeAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/resume-ai")
@RequiredArgsConstructor
public class ResumeAiController {

    private final ResumeAiService resumeAiService;

    // Upload resume file → extract text → store in RAG
    @PostMapping("/upload")
    public ResponseEntity<Resume> uploadResume(
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(resumeAiService.uploadResume(file));
    }

    // Analyze resume with AI
    @GetMapping("/analyze/{resumeId}")
    public ResponseEntity<Map<String, String>> analyzeResume(
            @PathVariable Long resumeId) {
        String analysis = resumeAiService.analyzeResume(resumeId);
        return ResponseEntity.ok(Map.of("analysis", analysis));
    }
}