package backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://neighborly-kohl.vercel.app"
    }
)
public class HelpRequestController {

    private final HelpRequestRepository repository;

    public HelpRequestController(HelpRequestRepository repository) {
        this.repository = repository;
    }

    // Get all help requests
    @GetMapping
    public List<HelpRequest> getAllRequests() {
        return repository.findAll();
    }

    // Create a help request
    @PostMapping
    public HelpRequest createRequest(@RequestBody HelpRequest request) {
        return repository.save(request);
    }

    // Get requests created by a particular user
    @GetMapping("/user/{userId}")
    public List<HelpRequest> getUserRequests(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    // Delete a request
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.ok().body("Request deleted successfully");
    }
}