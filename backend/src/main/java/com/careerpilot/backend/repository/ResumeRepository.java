package com.careerpilot.backend.repository;

import com.careerpilot.backend.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserId(Long userId);
    Optional<Resume> findByIdAndUserId(Long id, Long userId);
}