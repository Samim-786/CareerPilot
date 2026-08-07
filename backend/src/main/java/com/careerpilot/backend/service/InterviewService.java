package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.InterviewQuestion;
import com.careerpilot.backend.entity.InterviewSession;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.InterviewSessionRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<InterviewSession> getAllSessions() {
        return sessionRepository.findByUserIdOrderByCreatedAtDesc(
                getCurrentUser().getId());
    }

    public InterviewSession getSession(Long id) {
        return sessionRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public InterviewSession createSession(String jobRole, String difficulty) {
        InterviewSession session = InterviewSession.builder()
                .user(getCurrentUser())
                .jobRole(jobRole)
                .difficulty(difficulty != null ? difficulty : "MEDIUM")
                .questions(new ArrayList<>())
                .build();
        return sessionRepository.save(session);
    }

    public InterviewSession submitAnswer(Long sessionId,
            InterviewQuestion question) {
        InterviewSession session = getSession(sessionId);
        question.setSession(session);
        session.getQuestions().add(question);
        return sessionRepository.save(session);
    }

    public InterviewSession updateScore(Long sessionId,
            Integer score, String feedback) {
        InterviewSession session = getSession(sessionId);
        session.setScore(score);
        session.setFeedback(feedback);
        return sessionRepository.save(session);
    }

    public void deleteSession(Long id) {
        InterviewSession session = getSession(id);
        sessionRepository.delete(session);
    }
}