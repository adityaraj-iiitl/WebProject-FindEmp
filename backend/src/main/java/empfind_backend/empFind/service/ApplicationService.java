package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.Application;
import empfind_backend.empFind.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Application applyToJob(Application application) {
        return applicationRepository.save(application);
    }

    public List<Application> getUserApplications(Long userId) {
        return applicationRepository.findByUserId(userId);
    }
}
