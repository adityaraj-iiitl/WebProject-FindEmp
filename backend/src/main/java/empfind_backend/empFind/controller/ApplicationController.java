package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.Application;
import empfind_backend.empFind.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(@RequestBody Application application) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.applyToJob(application));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Application>> getApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getUserApplications(userId));
    }
}
