package empfind_backend.empFind.repository;

import empfind_backend.empFind.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserEmailOrderByTimestampAsc(String userEmail);
}
