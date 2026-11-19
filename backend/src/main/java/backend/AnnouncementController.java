
package backend;

import jakarta.servlet.http.HttpSession;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementController(
            AnnouncementRepository announcementRepository,
            UserRepository userRepository) {

        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    // ADMIN: SEND ANNOUNCEMENT TO EVERY USER
    @PostMapping
    public ResponseEntity<?> createAnnouncement(
            @RequestBody Map<String, String> data,
            HttpSession session) {

        Object sessionUserId = session.getAttribute("userId");

        if (!(sessionUserId instanceof Long)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please login first"));
        }

        Long userId = (Long) sessionUserId;

        Optional<User> optionalUser =
                userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "User not found"));
        }

        User admin = optionalUser.get();

        if (!"ADMIN".equals(admin.getRole())) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "message",
                            "Only administrators can send announcements"
                    ));
        }

        String title = data.get("title");
        String message = data.get("message");

        if (title == null || title.isBlank()
                || message == null || message.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Title and message are required"
                    ));
        }

        Announcement announcement = new Announcement();

        announcement.setTitle(title);
        announcement.setMessage(message);
        announcement.setSender(admin.getName());

        Announcement saved =
                announcementRepository.save(announcement);

        return ResponseEntity.ok(saved);
    }

    // ALL LOGGED-IN USERS: VIEW ANNOUNCEMENTS
    @GetMapping
    public ResponseEntity<?> getAnnouncements(
            HttpSession session) {

        Object sessionUserId = session.getAttribute("userId");

        if (!(sessionUserId instanceof Long)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please login first"));
        }

        return ResponseEntity.ok(
                announcementRepository.findAll(
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
        );
    }
}
