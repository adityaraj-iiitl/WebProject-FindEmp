package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.JobApplication;
import empfind_backend.empFind.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class JobApplicationController {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @PostMapping
    public JobApplication apply(@RequestBody JobApplication application) {
        return applicationRepository.save(application);
    }

    @GetMapping("/applicant/{applicantId}")
    public List<JobApplication> getByApplicant(@PathVariable Long applicantId) {
        return applicationRepository.findByApplicantId(applicantId);
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<JobApplication> getByRecruiter(@PathVariable Long recruiterId) {
        return applicationRepository.findByRecruiterId(recruiterId);
    }
    
    @GetMapping("/job/{jobId}")
    public List<JobApplication> getByJob(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @PutMapping("/{id}/status")
    public JobApplication updateStatus(@PathVariable Long id, @RequestParam String status) {
        JobApplication app = applicationRepository.findById(id).orElse(null);
        if (app != null) {
            app.setStatus(status);
            return applicationRepository.save(app);
        }
        return null;
    }
}
