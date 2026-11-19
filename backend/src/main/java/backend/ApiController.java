
package backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://neighborly-kohl.vercel.app"
    },
    allowCredentials = "true"
)
public class ApiController {

    private final UserRepository userRepository;
    private final HelpRequestRepository helpRequestRepository;
    private final DonationRepository donationRepository;
    private final VolunteerRepository volunteerRepository;
    private final AnnouncementRepository announcementRepository;

    public ApiController(
            UserRepository userRepository,
            HelpRequestRepository helpRequestRepository,
            DonationRepository donationRepository,
            VolunteerRepository volunteerRepository,
            AnnouncementRepository announcementRepository) {

        this.userRepository = userRepository;
        this.helpRequestRepository = helpRequestRepository;
        this.donationRepository = donationRepository;
        this.volunteerRepository = volunteerRepository;
        this.announcementRepository = announcementRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllData(HttpSession session) {

        Object sessionUserId = session.getAttribute("userId");

        if (!(sessionUserId instanceof Long)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please login first"));
        }

        Optional<User> loggedInUser =
                userRepository.findById((Long) sessionUserId);

        if (loggedInUser.isEmpty() ||
                !"ADMIN".equals(loggedInUser.get().getRole())) {

            return ResponseEntity.status(403)
                    .body(Map.of("message", "Admin access required"));
        }

        List<Map<String, Object>> safeUsers = new ArrayList<>();

        userRepository.findAll().forEach(user -> {
            Map<String, Object> member = new LinkedHashMap<>();

            member.put("id", user.getId());
            member.put("name", user.getName());
            member.put("email", user.getEmail());
            member.put("phone", user.getPhone());
            member.put("city", user.getCity());
            member.put("area", user.getArea());
            member.put("role", user.getRole());

            safeUsers.add(member);
        });

        Map<String, Object> data = new LinkedHashMap<>();

        data.put("message", "Neighborly Backend API");
        data.put("users", safeUsers);
        data.put("helpRequests", helpRequestRepository.findAll());
        data.put("donations", donationRepository.findAll());
        data.put("volunteers", volunteerRepository.findAll());
        data.put("announcements", announcementRepository.findAll());

        return ResponseEntity.ok(data);
    }
}
