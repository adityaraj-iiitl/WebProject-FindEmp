package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.JobApplication;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.repository.JobApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(JobApplicationService.class);

    @Autowired
    private JobApplicationRepository applicationRepository;

    public JobApplication apply(JobApplication application) {
        logger.info("Applicant {} is applying for job: {}", application.getApplicantId(), application.getJobId());
        return applicationRepository.save(application);
    }

    public List<JobApplication> getByApplicant(Long applicantId) {
        logger.info("Fetching job applications for applicant: {}", applicantId);
        return applicationRepository.findByApplicantId(applicantId);
    }

    public List<JobApplication> getByRecruiter(Long recruiterId) {
        logger.info("Fetching job applications for recruiter: {}", recruiterId);
        return applicationRepository.findByRecruiterId(recruiterId);
    }

    public List<JobApplication> getByJob(Long jobId) {
        logger.info("Fetching job applications for job: {}", jobId);
        return applicationRepository.findByJobId(jobId);
    }

    public JobApplication updateStatus(Long id, String status) {
        logger.info("Updating application status. id: {}, new status: {}", id, status);
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job application not found with id: " + id));
        app.setStatus(status);
        return applicationRepository.save(app);
    }
}
