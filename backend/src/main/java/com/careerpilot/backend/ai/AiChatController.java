package com.careerpilot.backend.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final RagService ragService;
    private final ChatClient.Builder chatClientBuilder;

    // Ask AI with RAG context
    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(
            @RequestBody Map<String, String> body) {

        String question = body.get("question");
        String userId = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        String answer = ragService.askWithContext(question, userId);

        return ResponseEntity.ok(Map.of(
                "question", question,
                "answer", answer
        ));
    }

    // Store resume text into vector store
    @PostMapping("/store")
    public ResponseEntity<Map<String, String>> storeText(
            @RequestBody Map<String, String> body) {

        String text = body.get("text");
        String userId = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        ragService.storeDocuments(text, Map.of("userId", userId));

        return ResponseEntity.ok(Map.of(
                "message", "Stored successfully"
        ));
    }

    // Simple direct chat with Groq (no RAG)
    @PostMapping("/simple-chat")
    public ResponseEntity<Map<String, String>> simpleChat(
            @RequestBody Map<String, String> body) {

        String question = body.get("question");

        String answer = chatClientBuilder.build()
                .prompt()
                .user(question)
                .call()
                .content();

        return ResponseEntity.ok(Map.of(
                "question", question,
                "answer", answer
        ));
    }
}

// POST /api/ai/simple-chat  → direct Groq chat (no RAG)
//      body: {"question": "What is Java?"}

// POST /api/ai/store        → store text in vector DB
//      body: {"text": "resume content here..."}

// POST /api/ai/chat         → RAG chat (uses your stored data)
//      body: {"question": "What skills do I have?"}