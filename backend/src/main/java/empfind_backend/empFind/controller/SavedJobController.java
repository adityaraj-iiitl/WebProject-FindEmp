package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.SavedJob;
import empfind_backend.empFind.service.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/saved-jobs")
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    @PostMapping("/toggle")
    public ResponseEntity<String> toggleSaveJob(@RequestParam Long userId, @RequestParam Long jobId) {
        return ResponseEntity.ok(savedJobService.toggleSaveJob(userId, jobId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<SavedJob>> getSavedJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(savedJobService.getSavedJobs(userId));
    }
}
