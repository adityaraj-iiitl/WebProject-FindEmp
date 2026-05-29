package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.JobApplication;
import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.repository.JobApplicationRepository;
import empfind_backend.empFind.repository.JobRepository;
import empfind_backend.empFind.repository.SavedJobRepository;
import empfind_backend.empFind.repository.CompanyRepository;
import empfind_backend.empFind.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

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

    public Map<String, Object> getDashboardStats(Long userId, String role) {
        logger.info("Compiling dashboard stats for user: {}, role: {}", userId, role);
        Map<String, Object> stats = new HashMap<>();

        if ("RECRUITER".equalsIgnoreCase(role)) {
            List<JobApplication> recruiterApps = applicationRepository.findByRecruiterId(userId);
            long companyCount = companyRepository.findByRecruiterId(userId).size();
            long activeJobsCount = jobRepository.countByRecruiterId(userId);

            stats.put("totalApplicants", recruiterApps.size());
            stats.put("activeJobs", activeJobsCount);
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
                    .filter(a -> "ACCEPTED".equalsIgnoreCase(a.getStatus()))
                    .count();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            stats.put("applicationsSent", applications.size());
            stats.put("profileViews", user.getProfileViews());
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
                    }).collect(Collectors.toList()));
        }

        return stats;
    }
}
