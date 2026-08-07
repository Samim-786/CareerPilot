package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.Roadmap;
import com.careerpilot.backend.service.RoadmapAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/roadmap-ai")
@RequiredArgsConstructor
public class RoadmapAiController {

    private final RoadmapAiService roadmapAiService;

    @PostMapping("/generate")
    public ResponseEntity<Roadmap> generateRoadmap(
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                roadmapAiService.generateRoadmap(
                        body.get("targetRole"),
                        body.get("currentSkills")));
    }
}

/*
POST /api/roadmap-ai/generate
body: {
  "targetRole": "Full Stack Developer",
  "currentSkills": "Java, Spring Boot, basic React"
}
→ AI generates 5 step learning roadmap
*/