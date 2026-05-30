package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.exception.ResourceNotFoundException;
import empfind_backend.empFind.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User profileData) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        user.setTitle(profileData.getTitle());
        user.setBio(profileData.getBio());
        user.setSkills(profileData.getSkills());
        user.setResumeUrl(profileData.getResumeUrl());
        user.setProfilePicUrl(profileData.getProfilePicUrl());
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementProfileViews(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        user.setProfileViews(user.getProfileViews() + 1);
        userService.registerUser(user);
        return ResponseEntity.ok().build();
    }
}
