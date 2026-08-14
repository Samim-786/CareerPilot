package com.careerpilot.backend.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HuggingFaceEmbeddingModel implements EmbeddingModel {

    @Value("${HF_API_TOKEN}")
    private String hfToken;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String HF_URL = "https://router.huggingface.co/hf-inference/models/" +
            "sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

    @Override
    public @NonNull float[] embed(@NonNull String text) {

        try {
            String body = objectMapper.writeValueAsString(
                    new java.util.HashMap<>() {{ put("inputs", text); }}
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(HF_URL))
                    .header("Authorization", "Bearer " + hfToken)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("HuggingFace API error: HTTP " + response.statusCode()
                        + " - " + response.body());
            }

            // Response can be either a flat float array [0.1, 0.2, ...]
            // or a nested array [[0.1, 0.2, ...]] depending on the model/endpoint.
            List<?> raw = objectMapper.readValue(response.body(), List.class);

            List<?> values = (!raw.isEmpty() && raw.get(0) instanceof List)
                    ? (List<?>) raw.get(0)
                    : raw;

            float[] embedding = new float[values.size()];
            for (int i = 0; i < values.size(); i++) {
                embedding[i] = ((Number) values.get(i)).floatValue();
            }

            return embedding;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get embedding from HuggingFace API", e);
        }
    }

    @SuppressWarnings("null")
    @Override
    public @NonNull float[] embed(@NonNull Document document) {
        return embed(document.getText());
    }

    @Override
    public @NonNull List<float[]> embed(@NonNull List<String> texts) {

        List<float[]> result = new ArrayList<>();

        for (String text : texts) {
            result.add(embed(text));
        }

        return result;
    }

    @Override
    public @NonNull EmbeddingResponse call(@Nullable EmbeddingRequest request) {

        if (request == null || request.getInstructions().isEmpty()) {
            return new EmbeddingResponse(List.of());
        }

        List<Embedding> embeddings = new ArrayList<>();

        for (String text : request.getInstructions()) {
            embeddings.add(new Embedding(embed(text), 0));
        }

        return new EmbeddingResponse(embeddings);
    }
}