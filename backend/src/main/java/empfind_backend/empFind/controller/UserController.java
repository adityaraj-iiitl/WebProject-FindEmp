package empfind_backend.empFind.controller;

import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Optional<User> login(@RequestBody User loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/profile/{id}")
    public User updateProfile(@PathVariable Long id, @RequestBody User profileData) {
        User user = userService.getUserById(id);
        if (user != null) {
            user.setTitle(profileData.getTitle());
            user.setBio(profileData.getBio());
            user.setSkills(profileData.getSkills());
            user.setResumeUrl(profileData.getResumeUrl());
            user.setProfilePicUrl(profileData.getProfilePicUrl());
            return userService.registerUser(user); // Reuse registerUser for save/update
        }
        return null;
    }

    @PostMapping("/{id}/view")
    public void incrementProfileViews(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            user.setProfileViews(user.getProfileViews() + 1);
            userService.registerUser(user);
        }
    }
}
