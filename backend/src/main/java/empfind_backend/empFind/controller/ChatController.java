package empfind_backend.empFind.controller;

import empfind_backend.empFind.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String userEmail = request.get("userEmail");
        
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("answer", "Please provide a message."));
        }
        
        return ResponseEntity.ok(chatService.processChat(message, userEmail));
    }
}
