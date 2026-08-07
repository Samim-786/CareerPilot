package com.careerpilot.backend.controller;

import com.careerpilot.backend.entity.Roadmap;
import com.careerpilot.backend.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<List<Roadmap>> getAllRoadmaps() {
        return ResponseEntity.ok(roadmapService.getAllRoadmaps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Roadmap> getRoadmap(@PathVariable Long id) {
        return ResponseEntity.ok(roadmapService.getRoadmap(id));
    }

    @PostMapping
    public ResponseEntity<Roadmap> createRoadmap(@RequestBody Roadmap roadmap) {
        return ResponseEntity.ok(roadmapService.createRoadmap(roadmap));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Roadmap> updateRoadmap(@PathVariable Long id,
                                                  @RequestBody Roadmap roadmap) {
        return ResponseEntity.ok(roadmapService.updateRoadmap(id, roadmap));
    }

    @PutMapping("/{roadmapId}/steps/{stepId}/complete")
    public ResponseEntity<Roadmap> markStepCompleted(
            @PathVariable Long roadmapId,
            @PathVariable Long stepId) {
        return ResponseEntity.ok(
                roadmapService.markStepCompleted(roadmapId, stepId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoadmap(@PathVariable Long id) {
        roadmapService.deleteRoadmap(id);
        return ResponseEntity.noContent().build();
    }
}