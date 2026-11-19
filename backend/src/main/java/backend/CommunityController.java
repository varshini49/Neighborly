
package backend;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/community")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class CommunityController {

    private final UserRepository userRepository;

    public CommunityController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/members")
    public ResponseEntity<?> getCommunityMembers(HttpSession session) {

        Object sessionUserId = session.getAttribute("userId");

        if (!(sessionUserId instanceof Long)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Please login first"));
        }

        List<Map<String, Object>> members = new ArrayList<>();

        userRepository.findAll().forEach(user -> {

            Map<String, Object> member = new LinkedHashMap<>();

            member.put("id", user.getId());
            member.put("name", user.getName());
            member.put("role",
                    "ADMIN".equals(user.getRole()) ? "Admin" : "Member");
            member.put("city", user.getCity());
            member.put("area", user.getArea());

            members.add(member);
        });

        return ResponseEntity.ok(members);
    }
}
