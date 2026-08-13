package com.careerpilot.backend.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagService {

    private final VectorStore vectorStore;
    private final ChatClient.Builder chatClientBuilder;

    public void storeDocuments(String text, Map<String, Object> metadata) {
    try {
        List<String> chunks = splitIntoChunks(text, 500);

        List<Document> documents = chunks.stream()
                .map(chunk -> new Document(chunk, metadata))
                .collect(Collectors.toList());

        log.info("About to store {} chunks", documents.size());

        vectorStore.add(documents);

        log.info("Stored {} chunks in vector store", documents.size());

    } catch (Exception e) {
        log.error("VECTOR STORE ERROR", e);
        throw e;
    }
}

    public List<Document> searchSimilarChunks(String query, String userId, int topK) {

        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(topK)
                        .similarityThreshold(0.3)
                        .filterExpression("userId == '" + userId + "'")
                        .build());
    }

    public String askWithContext(String question, String userId) {
        List<Document> relevantDocs = searchSimilarChunks(question,userId, 5);

        log.info("Found {} relevant chunks for question: {}",
                relevantDocs.size(), question);

        String context = relevantDocs.isEmpty()
                ? "No specific context available."
                : relevantDocs.stream()
                        .map(Document::getText)
                        .collect(Collectors.joining("\n\n"));

        String prompt = """
                You are CareerPilot AI, an intelligent career assistant.
                Use the following context to answer the question.
                If context says "No specific context available",
                answer from your general knowledge.

                Context:
                %s

                Question: %s

                Answer:
                """.formatted(context, question);

        return chatClientBuilder.build()
                .prompt()
                .user(prompt)
                .call()
                .content();
    }

    private List<String> splitIntoChunks(String text, int chunkSize) {
        List<String> chunks = new java.util.ArrayList<>();
        String[] words = text.split("\\s+");
        StringBuilder chunk = new StringBuilder();

        for (String word : words) {
            if (chunk.length() + word.length() > chunkSize) {
                chunks.add(chunk.toString().trim());
                chunk = new StringBuilder();
            }
            chunk.append(word).append(" ");
        }

        if (!chunk.isEmpty()) {
            chunks.add(chunk.toString().trim());
        }

        return chunks;
    }
}