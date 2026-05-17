package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getJobs() {
        return jobService.getAllJobs();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.saveJob(job);
    }

    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @GetMapping("/search")
    public List<Job> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location) {
        return jobService.searchJobs(keyword, location);
    }

    @GetMapping("/companies")
    public List<String> getCompanies() {
        return jobService.getUniqueCompanies();
    }

    @GetMapping("/company/{name}")
    public List<Job> getJobsByCompany(@PathVariable String name) {
        return jobService.getJobsByCompany(name);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<Job> getJobsByRecruiter(@PathVariable Long recruiterId) {
        return jobService.getJobsByRecruiter(recruiterId);
    }
    
    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job job) {
        Job existing = jobService.getJobById(id);
        if (existing != null) {
            job.setId(id);
            return jobService.saveJob(job);
        }
        return null;
    }
    
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) {
        // Here we could add a check to make sure the recruiter owns the job
        // For simplicity, we'll just delete it
        jobService.deleteJob(id);
    }

    @PostMapping("/{id}/view")
    public void incrementViews(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        if (job != null) {
            job.setViews(job.getViews() + 1);
            jobService.saveJob(job);
        }
    }
}
