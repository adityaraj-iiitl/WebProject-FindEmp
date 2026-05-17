package empfind_backend.empFind.repository;

import empfind_backend.empFind.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByApplicantId(Long applicantId);
    List<JobApplication> findByJobId(Long jobId);
    
    // Find applications for jobs posted by a specific recruiter
    @Query("SELECT a FROM JobApplication a JOIN Job j ON a.jobId = j.id WHERE j.recruiterId = :recruiterId")
    List<JobApplication> findByRecruiterId(Long recruiterId);
}
