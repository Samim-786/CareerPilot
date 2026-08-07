package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.InterviewQuestion;
import com.careerpilot.backend.entity.InterviewSession;
import com.careerpilot.backend.service.InterviewAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview-ai")
@RequiredArgsConstructor
public class InterviewAiController {

    private final InterviewAiService interviewAiService;

    // Generate interview questions
    @PostMapping("/generate")
    public ResponseEntity<InterviewSession> generateInterview(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                interviewAiService.generateInterview(
                        body.get("jobRole"),
                        body.get("difficulty")));
    }

    // Submit answer for evaluation
    @PostMapping("/{sessionId}/evaluate/{questionId}")
    public ResponseEntity<InterviewQuestion> evaluateAnswer(
            @PathVariable Long sessionId,
            @PathVariable Long questionId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                interviewAiService.evaluateAnswer(
                        sessionId,
                        questionId,
                        body.get("answer")));
    }

    // Finalize session and get overall score
    @PostMapping("/{sessionId}/finalize")
    public ResponseEntity<InterviewSession> finalizeSession(
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(
                interviewAiService.finalizeSession(sessionId));
    }
}



// POST /api/interview-ai/generate
//      body: {"jobRole": "Backend Developer", "difficulty": "MEDIUM"}
//      → AI generates 5 questions

// POST /api/interview-ai/{sessionId}/evaluate/{questionId}
//      body: {"answer": "your answer here"}
//      → AI scores and gives feedback

// POST /api/interview-ai/{sessionId}/finalize
//      → calculates average score
//      → AI gives overall feedback