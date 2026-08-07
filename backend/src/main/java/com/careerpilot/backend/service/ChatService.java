package com.careerpilot.backend.service;

import com.careerpilot.backend.entity.Chat;
import com.careerpilot.backend.entity.Message;
import com.careerpilot.backend.entity.User;
import com.careerpilot.backend.repository.ChatRepository;
import com.careerpilot.backend.repository.MessageRepository;
import com.careerpilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Chat> getAllChats() {
        return chatRepository.findByUserIdOrderByCreatedAtDesc(
                getCurrentUser().getId());
    }

    public Chat getChat(Long id) {
        return chatRepository.findByIdAndUserId(id, getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Chat not found"));
    }

    public Chat createChat(String title) {
        Chat chat = Chat.builder()
                .user(getCurrentUser())
                .title(title != null ? title : "New Chat")
                .build();
        return chatRepository.save(chat);
    }

    public List<Message> getMessages(Long chatId) {
        getChat(chatId); // verify ownership
        return messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
    }

    public Message saveMessage(Long chatId, String role, String content) {
        Chat chat = getChat(chatId);
        Message message = Message.builder()
                .chat(chat)
                .role(role)
                .content(content)
                .build();
        return messageRepository.save(message);
    }

    public void deleteChat(Long id) {
        Chat chat = getChat(id);
        chatRepository.delete(chat);
    }

    public Chat updateChatTitle(Long chatId, String title) {

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        chat.setTitle(title);

        return chatRepository.save(chat);
    }
}