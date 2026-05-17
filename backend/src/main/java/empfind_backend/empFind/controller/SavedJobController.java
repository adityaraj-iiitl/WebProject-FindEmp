package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.entity.SavedJob;
import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.repository.JobRepository;
import empfind_backend.empFind.repository.SavedJobRepository;
import empfind_backend.empFind.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/saved-jobs")
@CrossOrigin(origins = "*")
public class SavedJobController {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping("/toggle")
    public String toggleSaveJob(@RequestParam Long userId, @RequestParam Long jobId) {
        Optional<SavedJob> existing = savedJobRepository.findByUserIdAndJobId(userId, jobId);
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            return "UNSAVED";
        } else {
            Optional<User> user = userRepository.findById(userId);
            Optional<Job> job = jobRepository.findById(jobId);
            if (user.isPresent() && job.isPresent()) {
                savedJobRepository.save(new SavedJob(user.get(), job.get()));
                return "SAVED";
            }
            return "ERROR";
        }
    }

    @GetMapping("/{userId}")
    public List<SavedJob> getSavedJobs(@PathVariable Long userId) {
        return savedJobRepository.findByUserId(userId);
    }
}
