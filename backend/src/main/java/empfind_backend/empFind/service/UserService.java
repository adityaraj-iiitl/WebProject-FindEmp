package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.User;
import empfind_backend.empFind.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
