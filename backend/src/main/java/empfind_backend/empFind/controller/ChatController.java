package empfind_backend.empFind.controller;

import empfind_backend.empFind.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public Map<String, Object> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String userEmail = request.get("userEmail"); // Optional
        
        if (message == null || message.trim().isEmpty()) {
            return Map.of("answer", "Please provide a message.");
        }
        
        return chatService.processChat(message, userEmail);
    }
}
