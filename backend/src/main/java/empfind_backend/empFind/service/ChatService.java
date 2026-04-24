package empfind_backend.empFind.service;

import empfind_backend.empFind.entity.ChatMessage;
import empfind_backend.empFind.entity.Job;
import empfind_backend.empFind.repository.ChatMessageRepository;
import empfind_backend.empFind.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Value("${openrouter.api.key}")
    private String apiKey;

    private final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> processChat(String userMessage, String userEmail) {
        if (userEmail != null) {
            chatMessageRepository.save(new ChatMessage(userEmail, userMessage, "user"));
        }

        // Get a brief catalog of all available jobs to give the AI general knowledge
        List<Job> allJobs = jobRepository.findAll();
        String jobCatalog = allJobs.stream()
                .limit(10) // Limit to 10 for context window efficiency
                .map(j -> j.getTitle() + " at " + j.getCompany())
                .collect(Collectors.joining(", "));

        List<Job> recommendedJobs = new ArrayList<>();
        if (isJobSearchRequest(userMessage)) {
            recommendedJobs = findRelevantJobs(userMessage);
        }

        String systemPrompt = "You are a career assistant for 'FindEmp'. " +
                "Help users find jobs, improve resumes, and prepare for interviews. " +
                "Be concise and professional. You have access to our job database. " +
                "Available roles include: " + jobCatalog + ". " +
                "When users ask about jobs, refer to these or ask for their preferences.";
        
        String context = "";
        if (!recommendedJobs.isEmpty()) {
            context = "Specific relevant jobs for this query: " + 
                recommendedJobs.stream()
                    .map(j -> j.getTitle() + " at " + j.getCompany() + " in " + j.getLocation() + " (Salary: " + j.getSalary() + ")")
                    .collect(Collectors.joining("; "));
        }

        String fullPrompt = systemPrompt + "\n\nContext: " + context + "\n\nUser Question: " + userMessage;
        String assistantAnswer = callOpenRouter(fullPrompt);

        if (userEmail != null) {
            chatMessageRepository.save(new ChatMessage(userEmail, assistantAnswer, "assistant"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("answer", assistantAnswer);
        response.put("recommendedJobs", recommendedJobs);
        response.put("followUpSuggestions", getFollowUpSuggestions(userMessage, recommendedJobs));

        return response;
    }

    private boolean isJobSearchRequest(String message) {
        String lower = message.toLowerCase();
        return lower.contains("job") || lower.contains("work") || lower.contains("hiring") || 
               lower.contains("developer") || lower.contains("engineer") || lower.contains("opening");
    }

    private List<Job> findRelevantJobs(String message) {
        String[] keywords = message.split("\\s+");
        Set<Job> jobs = new HashSet<>();
        for (String word : keywords) {
            String cleanWord = word.replaceAll("[^a-zA-Z0-9]", "");
            if (cleanWord.length() > 2) {
                // Search by title or description
                jobs.addAll(jobRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(cleanWord, cleanWord));
                // Search by company
                jobs.addAll(jobRepository.findByCompany(cleanWord));
                // Search by location (we'll use a stream filter for this since repo doesn't have a specific combined method yet)
            }
        }
        
        // Final pass for location matching
        String lowerMessage = message.toLowerCase();
        List<Job> allJobs = jobRepository.findAll();
        for (Job j : allJobs) {
            if (j.getLocation() != null && lowerMessage.contains(j.getLocation().toLowerCase())) {
                jobs.add(j);
            }
        }

        return jobs.stream().limit(3).collect(Collectors.toList());
    }

    private String callOpenRouter(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            headers.set("HTTP-Referer", "http://localhost:5173"); // Required by OpenRouter
            headers.set("X-Title", "FindEmp Job Portal");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "google/gemini-2.0-flash-001");
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            requestBody.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                List choices = (List) response.getBody().get("choices");
                Map firstChoice = (Map) choices.get(0);
                Map message = (Map) firstChoice.get("message");
                return (String) message.get("content");
            }
        } catch (Exception e) {
            return "Error connecting to OpenRouter: " + e.getMessage();
        }
        return "I'm sorry, I couldn't process that request.";
    }

    private List<String> getFollowUpSuggestions(String message, List<Job> jobs) {
        List<String> suggestions = new ArrayList<>();
        if (jobs.isEmpty()) {
            suggestions.add("Show all remote jobs");
            suggestions.add("Help me with my resume");
        } else {
            suggestions.add("Tell me more about " + jobs.get(0).getCompany());
            suggestions.add("How to prepare for " + jobs.get(0).getTitle() + " interview?");
        }
        suggestions.add("Interview tips");
        return suggestions;
    }
}
