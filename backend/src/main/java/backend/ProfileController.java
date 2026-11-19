
package backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // UPDATE PROFILE
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> data) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        String name = data.get("name");
        String email = data.get("email");
        String phone = data.get("phone");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Name and email are required"));
        }

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isPresent()
                && !existingUser.get().getId().equals(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            "Email is already in use"));
        }

        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail(),
                "phone", savedUser.getPhone() == null
                        ? "" : savedUser.getPhone()
        ));
    }

    // SAVE LOCATION
    @PutMapping("/{id}/location")
    public ResponseEntity<?> updateLocation(
            @PathVariable Long id,
            @RequestBody Map<String, String> data) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        user.setCity(data.get("city"));
        user.setArea(data.get("area"));
        user.setAddress(data.get("address"));

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "id", savedUser.getId(),
                "city", savedUser.getCity() == null
                        ? "" : savedUser.getCity(),
                "area", savedUser.getArea() == null
                        ? "" : savedUser.getArea(),
                "address", savedUser.getAddress() == null
                        ? "" : savedUser.getAddress()
        ));
    }

    // GET SAVED LOCATION
    @GetMapping("/{id}/location")
    public ResponseEntity<?> getLocation(
            @PathVariable Long id) {

        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "city", user.getCity() == null
                        ? "" : user.getCity(),
                "area", user.getArea() == null
                        ? "" : user.getArea(),
                "address", user.getAddress() == null
                        ? "" : user.getAddress()
        ));
    }
}
