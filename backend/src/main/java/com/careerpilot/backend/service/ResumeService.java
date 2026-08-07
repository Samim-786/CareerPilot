package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.Resume;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.ResumeRepository;
import com.careerpilot.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findByUserId(getCurrentUser().getId());
    }

    public Resume getResume(Long id) {
        return resumeRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Resume not found"));
    }

    public Resume createResume(Resume resume) {
        resume.setUser(getCurrentUser());
        return resumeRepository.save(resume);
    }

    public Resume updateResume(Long id, Resume updated) {
        Resume resume = getResume(id);
        resume.setFileName(updated.getFileName());
        resume.setFileUrl(updated.getFileUrl());
        resume.setExtractedText(updated.getExtractedText());
        resume.setSkills(updated.getSkills());
        resume.setExperienceYears(updated.getExperienceYears());
        return resumeRepository.save(resume);
    }

    public void deleteResume(Long id) {
        Resume resume = getResume(id);
        resumeRepository.delete(resume);
    }
}