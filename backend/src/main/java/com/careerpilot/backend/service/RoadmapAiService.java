package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.Roadmap;
import com.careerpilot.backend.entity.RoadmapStep;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.RoadmapRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoadmapAiService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Roadmap generateRoadmap(String targetRole,
                                    String currentSkills) {

        // Ask AI to generate roadmap
        String prompt = """
                Create a learning roadmap for someone who wants to become a %s.
                Their current skills are: %s
                
                Generate exactly 5 learning steps in this exact format:
                
                STEP 1
                Title: Step title here
                Description: Brief description here
                Duration: X weeks
                Resources: resource1, resource2, resource3
                
                STEP 2
                Title: Step title here
                Description: Brief description here
                Duration: X weeks
                Resources: resource1, resource2, resource3
                
                Continue for all 5 steps. No extra text.
                """.formatted(targetRole, currentSkills);

        String response = chatClientBuilder.build()
                .prompt()
                .user(prompt)
                .call()
                .content();

        log.info("AI Roadmap response: {}", response);

        // Parse steps
        List<RoadmapStep> steps = parseSteps(response);

        // Build roadmap
        Roadmap roadmap = Roadmap.builder()
                .user(getCurrentUser())
                .title("Roadmap to become " + targetRole)
                .targetRole(targetRole)
                .currentSkills(currentSkills.split(","))
                .steps(steps)
                .build();

        // Link steps to roadmap
        steps.forEach(step -> step.setRoadmap(roadmap));

        return roadmapRepository.save(roadmap);
    }

    private List<RoadmapStep> parseSteps(String response) {
        List<RoadmapStep> steps = new ArrayList<>();
        String[] sections = response.split("STEP \\d+");

        int order = 1;
        for (String section : sections) {
            section = section.trim();
            if (section.isEmpty()) continue;

            String title = extractField(section, "Title:");
            String description = extractField(section, "Description:");
            String durationStr = extractField(section, "Duration:");
            String resourcesStr = extractField(section, "Resources:");

            int duration = 2;
            try {
                duration = Integer.parseInt(
                        durationStr.replaceAll("[^0-9]", "").trim());
            } catch (NumberFormatException e) {
                duration = 2;
            }

            String[] resources = resourcesStr.split(",");

            RoadmapStep step = RoadmapStep.builder()
                    .stepOrder(order++)
                    .title(title)
                    .description(description)
                    .durationWeeks(duration)
                    .resources(resources)
                    .isCompleted(false)
                    .build();

            steps.add(step);
        }

        return steps;
    }

    private String extractField(String text, String fieldName) {
        for (String line : text.split("\n")) {
            if (line.trim().startsWith(fieldName)) {
                return line.replace(fieldName, "").trim();
            }
        }
        return "";
    }
}