package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.JobApplication;
import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.repository.JobApplicationRepository;
import empfind_backend.empFind.repository.JobRepository;
import empfind_backend.empFind.repository.SavedJobRepository;
import empfind_backend.empFind.repository.CompanyRepository;
import empfind_backend.empFind.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats/{userId}")
    public Map<String, Object> getDashboardStats(@PathVariable Long userId, @RequestParam(required = false) String role) {
        Map<String, Object> stats = new HashMap<>();

        if ("RECRUITER".equalsIgnoreCase(role)) {
            List<JobApplication> recruiterApps = applicationRepository.findByRecruiterId(userId);
            long companyCount = companyRepository.findByRecruiterId(userId).size();
            
            stats.put("totalApplicants", recruiterApps.size());
            stats.put("activeJobs", jobRepository.findAll().stream().filter(j -> j.getRecruiterId() != null && j.getRecruiterId().equals(userId)).count());
            stats.put("companiesManaged", companyCount);
            stats.put("recentApplications", recruiterApps.stream()
                .sorted(Comparator.comparing(JobApplication::getTimestamp).reversed())
                .limit(5)
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    Job j = jobRepository.findById(a.getJobId()).orElse(null);
                    map.put("applicant", a.getApplicantName());
                    map.put("role", j != null ? j.getTitle() : "Position");
                    map.put("status", a.getStatus());
                    map.put("date", a.getTimestamp().toString());
                    return map;
                }).collect(Collectors.toList()));
        } else {
            List<JobApplication> applications = applicationRepository.findByApplicantId(userId);
            long savedJobsCount = savedJobRepository.countByUserId(userId);
            
            long interviewCount = applications.stream()
                    .filter(a -> "ACCEPTED".equalsIgnoreCase(a.getStatus())) // Status ACCEPTED treated as interview invite
                    .count();

            stats.put("applicationsSent", applications.size());
            
            // Get REAL profile views from User entity
            int views = 0;
            empfind_backend.empFind.entity.User u = userRepository.findById(userId).orElse(null);
            if (u != null) views = u.getProfileViews();
            
            stats.put("profileViews", views);
            stats.put("interviewsScheduled", interviewCount);
            stats.put("savedJobs", savedJobsCount);
            stats.put("recentApplications", applications.stream()
                    .sorted(Comparator.comparing(JobApplication::getTimestamp).reversed())
                    .limit(5)
                    .map(a -> {
                        Map<String, Object> map = new HashMap<>();
                        Job j = jobRepository.findById(a.getJobId()).orElse(null);
                        map.put("role", j != null ? j.getTitle() : "Position");
                        map.put("company", j != null ? j.getCompany() : "Company");
                        map.put("status", a.getStatus());
                        map.put("date", a.getTimestamp().toString());
                        return map;
                    })
                    .collect(Collectors.toList()));
        }

        return stats;
    }
}
