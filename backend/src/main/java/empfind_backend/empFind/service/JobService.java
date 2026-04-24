package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.repository.JobRepository;
import empfind_backend.empFind.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job saveJob(Job job) {
        return jobRepository.save(job);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElse(null);
    }

    public List<Job> searchJobs(String keyword, String location) {
        if (keyword != null && !keyword.isEmpty() && location != null && !location.isEmpty()) {
            return jobRepository.findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(keyword, location);
        } else if (keyword != null && !keyword.isEmpty()) {
            return jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        } else if (location != null && !location.isEmpty()) {
            return jobRepository.findByLocationContainingIgnoreCase(location);
        }
        return jobRepository.findAll();
    }

    public List<String> getUniqueCompanies() {
        return jobRepository.findAll().stream()
                .map(Job::getCompany)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Job> getJobsByCompany(String name) {
        return jobRepository.findByCompany(name);
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        // Use a mutable list to avoid UnsupportedOperationException
        List<Job> jobs = new ArrayList<>(jobRepository.findByRecruiterId(recruiterId));
        
        // Also fetch jobs that match the recruiter's company names but have no recruiterId
        List<String> companyNames = companyRepository.findByRecruiterId(recruiterId)
                .stream()
                .map(c -> c.getName())
                .collect(Collectors.toList());
        
        if (!companyNames.isEmpty()) {
            List<Job> allJobs = jobRepository.findAll();
            List<Job> legacyJobs = allJobs.stream()
                    .filter(j -> j.getRecruiterId() == null && companyNames.contains(j.getCompany()))
                    .collect(Collectors.toList());
            
            // Repair data: save recruiterId to these jobs so applications can also find them
            for (Job lj : legacyJobs) {
                lj.setRecruiterId(recruiterId);
                jobRepository.save(lj);
                // Only add if not already in the list
                if (jobs.stream().noneMatch(j -> j.getId().equals(lj.getId()))) {
                    jobs.add(lj);
                }
            }
        }
        
        return jobs;
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
