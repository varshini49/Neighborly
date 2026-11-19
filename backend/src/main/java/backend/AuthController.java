
package backend;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Email already registered"));
        }

        user.setRole("USER");
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole()
        ));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user,
            HttpSession session) {

        var existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty() ||
            !passwordEncoder.matches(
                    user.getPassword(),
                    existingUser.get().getPassword())) {

            return ResponseEntity.status(401)
                    .body(Map.of("message",
                            "Invalid email or password"));
        }

        User loggedInUser = existingUser.get();

        // Store authenticated user ID in server session
        session.setAttribute("userId", loggedInUser.getId());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "id", loggedInUser.getId(),
                "name", loggedInUser.getName(),
                "email", loggedInUser.getEmail(),
                "role", loggedInUser.getRole()
        ));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }
}
