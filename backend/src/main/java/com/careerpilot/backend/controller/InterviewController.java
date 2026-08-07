package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.InterviewQuestion;
import com.careerpilot.backend.entity.InterviewSession;
import com.careerpilot.backend.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<List<InterviewSession>> getAllSessions() {
        return ResponseEntity.ok(interviewService.getAllSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewSession> getSession(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getSession(id));
    }

    @PostMapping
    public ResponseEntity<InterviewSession> createSession(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                interviewService.createSession(
                        body.get("jobRole"),
                        body.get("difficulty")));
    }

    @PostMapping("/{id}/answers")
    public ResponseEntity<InterviewSession> submitAnswer(
            @PathVariable Long id,
            @RequestBody InterviewQuestion question) {
        return ResponseEntity.ok(interviewService.submitAnswer(id, question));
    }

    @PutMapping("/{id}/score")
    public ResponseEntity<InterviewSession> updateScore(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(
                interviewService.updateScore(
                        id,
                        (Integer) body.get("score"),
                        (String) body.get("feedback")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        interviewService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}