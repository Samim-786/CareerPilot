package com.careerpilot.backend.repository;

import com.careerpilot.backend.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Chat> findByIdAndUserId(Long id, Long userId);
}