package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.JobApplication;
import empfind_backend.empFind.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @PostMapping
    public ResponseEntity<JobApplication> apply(@RequestBody JobApplication application) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.apply(application));
    }

    @GetMapping("/applicant/{applicantId}")
    public ResponseEntity<List<JobApplication>> getByApplicant(@PathVariable Long applicantId) {
        return ResponseEntity.ok(applicationService.getByApplicant(applicantId));
    }

    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobApplication>> getByRecruiter(@PathVariable Long recruiterId) {
        return ResponseEntity.ok(applicationService.getByRecruiter(recruiterId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobApplication>> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getByJob(jobId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }
}
