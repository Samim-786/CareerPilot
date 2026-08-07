package com.careerpilot.backend.repository;

import com.careerpilot.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByUserId(Long userId);
    Optional<Job> findByIdAndUserId(Long id, Long userId);
    List<Job> findByUserIdAndStatus(Long userId, String status);
}