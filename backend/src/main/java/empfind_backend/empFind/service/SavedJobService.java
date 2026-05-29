package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.entity.SavedJob;
import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.repository.JobRepository;
import empfind_backend.empFind.repository.SavedJobRepository;
import empfind_backend.empFind.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavedJobService {

    private static final Logger logger = LoggerFactory.getLogger(SavedJobService.class);

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    public String toggleSaveJob(Long userId, Long jobId) {
        logger.info("Toggling saved job for user: {} and job: {}", userId, jobId);
        Optional<SavedJob> existing = savedJobRepository.findByUserIdAndJobId(userId, jobId);
        if (existing.isPresent()) {
            savedJobRepository.delete(existing.get());
            logger.info("Deleted saved job record. Status: UNSAVED");
            return "UNSAVED";
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
            savedJobRepository.save(new SavedJob(user, job));
            logger.info("Created saved job record. Status: SAVED");
            return "SAVED";
        }
    }

    public List<SavedJob> getSavedJobs(Long userId) {
        logger.info("Fetching saved jobs for user: {}", userId);
        return savedJobRepository.findByUserId(userId);
    }
}
