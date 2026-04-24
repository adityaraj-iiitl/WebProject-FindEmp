package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Application;
import empfind_backend.empFind.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public Application apply(@RequestBody Application application) {
        return applicationService.applyToJob(application);
    }

    @GetMapping("/user/{userId}")
    public List<Application> getApplications(@PathVariable Long userId) {
        return applicationService.getUserApplications(userId);
    }
}
