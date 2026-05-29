package empfind_backend.empFind.controller;

import empfind_backend.empFind.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @PathVariable Long userId,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(userId, role));
    }
}
