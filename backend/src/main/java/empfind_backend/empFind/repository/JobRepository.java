package empfind_backend.empFind.repository;

import empfind_backend.empFind.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Job> findByTitleContainingIgnoreCaseAndLocationContainingIgnoreCase(String title, String location);
    List<Job> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT DISTINCT j.company FROM Job j")
    List<String> findUniqueCompanies();

    List<Job> findByCompany(String company);
    List<Job> findByRecruiterId(Long recruiterId);
}
