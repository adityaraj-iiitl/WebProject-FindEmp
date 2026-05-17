package empfind_backend.empFind.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_jobs")
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private LocalDateTime savedAt;

    public SavedJob() {
        this.savedAt = LocalDateTime.now();
    }

    public SavedJob(User user, Job job) {
        this.user = user;
        this.job = job;
        this.savedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Job getJob() { return job; }
    public LocalDateTime getSavedAt() { return savedAt; }
}
