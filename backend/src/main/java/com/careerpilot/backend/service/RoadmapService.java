package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.Roadmap;
import com.careerpilot.backend.entity.RoadmapStep;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.RoadmapRepository;
import com.careerpilot.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findByUserIdOrderByCreatedAtDesc(
                getCurrentUser().getId());
    }

    public Roadmap getRoadmap(Long id) {
        return roadmapRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() ->  new EntityNotFoundException("Roadmap not found"));
    }

    public Roadmap createRoadmap(Roadmap roadmap) {
        roadmap.setUser(getCurrentUser());
        return roadmapRepository.save(roadmap);
    }

    public Roadmap updateRoadmap(Long id, Roadmap updated) {
        Roadmap roadmap = getRoadmap(id);
        roadmap.setTitle(updated.getTitle());
        roadmap.setTargetRole(updated.getTargetRole());
        roadmap.setCurrentSkills(updated.getCurrentSkills());
        roadmap.setTargetSkills(updated.getTargetSkills());
        return roadmapRepository.save(roadmap);
    }

    public Roadmap markStepCompleted(Long roadmapId, Long stepId) {
        Roadmap roadmap = getRoadmap(roadmapId);
        roadmap.getSteps().stream()
                .filter(step -> step.getId().equals(stepId))
                .findFirst()
                .ifPresent(step -> step.setIsCompleted(true));
        return roadmapRepository.save(roadmap);
    }

    public void deleteRoadmap(Long id) {
        Roadmap roadmap = getRoadmap(id);
        roadmapRepository.delete(roadmap);
    }
}