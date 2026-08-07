package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.Chat;
import com.careerpilot.backend.entity.Message;
import com.careerpilot.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<Chat>> getAllChats() {
        return ResponseEntity.ok(chatService.getAllChats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Chat> getChat(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getChat(id));
    }

    @PostMapping
    public ResponseEntity<Chat> createChat(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(chatService.createChat(body.get("title")));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getMessages(id));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<Message> saveMessage(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                chatService.saveMessage(id, body.get("role"), body.get("content")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long id) {
        chatService.deleteChat(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Chat> updateChatTitle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return ResponseEntity.ok(
                chatService.updateChatTitle(id, body.get("title")));
    }

}