package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.Job;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.JobRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Job> getAllJobs() {
        return jobRepository.findByUserId(getCurrentUser().getId());
    }

    public List<Job> getJobsByStatus(String status) {
        return jobRepository.findByUserIdAndStatus(
                getCurrentUser().getId(), status);
    }

    public Job getJob(Long id) {
        return jobRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Job createJob(Job job) {
        job.setUser(getCurrentUser());
        if (job.getStatus() == null) {
            job.setStatus("WISHLIST");
        }
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updated) {
        Job job = getJob(id);
        job.setCompanyName(updated.getCompanyName());
        job.setJobTitle(updated.getJobTitle());
        job.setJobUrl(updated.getJobUrl());
        job.setStatus(updated.getStatus());
        job.setNotes(updated.getNotes());
        job.setAppliedDate(updated.getAppliedDate());
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        Job job = getJob(id);
        jobRepository.delete(job);
    }
}