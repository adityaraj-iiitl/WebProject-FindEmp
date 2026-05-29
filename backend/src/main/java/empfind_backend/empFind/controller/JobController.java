package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<Job>> getJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.saveJob(job));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job == null) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        return ResponseEntity.ok(job);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(jobService.searchJobs(keyword, location));
    }

    @GetMapping("/companies")
    public ResponseEntity<List<String>> getCompanies() {
        return ResponseEntity.ok(jobService.getUniqueCompanies());
    }

    @GetMapping("/company/{name}")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable String name) {
        return ResponseEntity.ok(jobService.getJobsByCompany(name));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<Job>> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiterId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job existing = jobService.getJobById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        job.setId(id);
        return ResponseEntity.ok(jobService.saveJob(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        Job existing = jobService.getJobById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job == null) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        job.setViews(job.getViews() + 1);
        jobService.saveJob(job);
        return ResponseEntity.ok().build();
    }
}
