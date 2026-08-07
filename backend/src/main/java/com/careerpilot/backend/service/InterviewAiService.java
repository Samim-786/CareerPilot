package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.InterviewQuestion;
import com.careerpilot.backend.entity.InterviewSession;
import com.careerpilot.backend.exception.BadRequestException;
import com.careerpilot.backend.exception.ResourceNotFoundException;
import com.careerpilot.backend.repository.InterviewSessionRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewAiService {

    private final InterviewSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;

    private com.careerpilot.backend.entity.User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Generate interview questions for a job role
    public InterviewSession generateInterview(String jobRole, String difficulty) {

        // Create session
        InterviewSession session = InterviewSession.builder()
                .user(getCurrentUser())
                .jobRole(jobRole)
                .difficulty(difficulty)
                .questions(new ArrayList<>())
                .build();

        // Ask AI to generate questions
        String prompt = """
                Generate 5 technical interview questions for a %s role.
                Difficulty level: %s

                The interview is for a final-year Computer Science student preparing
                for software engineering placements.

                Questions should match the requested difficulty but remain appropriate
                for an entry-level backend developer.

                Avoid senior-level distributed system and large-scale system design
                questions unless explicitly requested.
                
                Return ONLY a numbered list like this:
                1. Question one
                2. Question two
                3. Question three
                4. Question four
                5. Question five
                
                No extra text, just the questions.
                """.formatted(jobRole, difficulty);

        String response = chatClientBuilder.build()
                .prompt()
                .user(prompt)
                .call()
                .content();

        // Parse questions from response
        String[] lines = response.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.matches("^\\d+\\..*")) {
                String questionText = line.replaceFirst("^\\d+\\.\\s*", "");
                InterviewQuestion question = InterviewQuestion.builder()
                        .session(session)
                        .question(questionText)
                        .build();
                session.getQuestions().add(question);
            }
        }
        if (session.getQuestions().size() != 5) {
                throw new BadRequestException(
    "AI failed to generate all interview questions.");
        }

        return sessionRepository.save(session);
    }

    // Evaluate user answer with AI
    public InterviewQuestion evaluateAnswer(Long sessionId,
                                            Long questionId,
                                            String userAnswer) {

        InterviewSession session = sessionRepository
                .findByIdAndUserId(sessionId, getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        InterviewQuestion question = session.getQuestions().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (question.getUserAnswer() != null) {
                throw new BadRequestException("Question already answered.");
        }        

        // Ask AI to evaluate the answer
        String prompt = """
                You are a technical interviewer. Evaluate this answer.
                
                Question: %s
                Candidate's Answer: %s
                
                Provide:
                1. Score out of 10
                2. Brief feedback (2-3 sentences)
                
                Format exactly like this:
                Score: 7
                Feedback: Your feedback here.
                """.formatted(question.getQuestion(), userAnswer);

        String response = chatClientBuilder.build()
                .prompt()
                .user(prompt)
                .call()
                .content();

        // Parse score and feedback
        int score = 5;
        String feedback = response;

        for (String line : response.split("\n")) {
            line = line.trim();

                if (line.toLowerCase().startsWith("score:")) {
                        try {
                score = Integer.parseInt(
                        line.substring(6).trim());
            } catch (Exception ignored) {
                score = 5;
            }
        }

        if (line.toLowerCase().startsWith("feedback:")) {
            feedback = line.substring(9).trim();
        }
        }
        score = Math.max(0, Math.min(score, 10));
        question.setUserAnswer(userAnswer);
        question.setAiFeedback(feedback);
        question.setScore(score);

        return sessionRepository.save(session).getQuestions().stream()
                .filter(q -> q.getId().equals(questionId))
                .findFirst()
                .orElseThrow();
    }

    // Calculate final score for session
    public InterviewSession finalizeSession(Long sessionId) {
        InterviewSession session = sessionRepository
                .findByIdAndUserId(sessionId, getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (session.getScore() != null) {
        throw new BadRequestException("Interview already finalized.");
    }
        long unanswered = session.getQuestions().stream()
            .filter(q -> q.getScore() == null)
            .count();

        if (unanswered > 0) {
               throw new BadRequestException(
    "Please answer all interview questions before finalizing.");
        }
        // Average score of all questions
        double average = session.getQuestions().stream()
            .mapToInt(InterviewQuestion::getScore)
            .average()
            .orElse(0);

        // Ask AI for overall feedback
        String prompt = """
            Give overall interview feedback.

            Job Role: %s

            Average Score: %.1f/10

            Write 2-3 encouraging sentences.
            """.formatted(session.getJobRole(), average);

        String overallFeedback = chatClientBuilder.build()
                .prompt()
                .user(prompt)
                .call()
                .content();

        session.setScore((int) Math.round(average));
        session.setFeedback(overallFeedback);

        return sessionRepository.save(session);
    }
}