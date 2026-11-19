
package backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://neighborly-kohl.vercel.app"
    }
)
public class VolunteerController {

    private final VolunteerRepository repository;
    private final HelpRequestRepository requestRepository;

    public VolunteerController(
            VolunteerRepository repository,
            HelpRequestRepository requestRepository) {
        this.repository = repository;
        this.requestRepository = requestRepository;
    }

    // Add volunteer
    @PostMapping
    public ResponseEntity<?> addVolunteer(@RequestBody Volunteer volunteer) {

        if (volunteer.getRequestId() == null ||
            volunteer.getUserId() == null) {
            return ResponseEntity.badRequest()
                    .body("Request ID and User ID are required");
        }

        if (!requestRepository.existsById(volunteer.getRequestId())) {
            return ResponseEntity.notFound().build();
        }

        if (repository.findByRequestIdAndUserId(
                volunteer.getRequestId(),
                volunteer.getUserId()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("You have already volunteered for this request");
        }

        Volunteer savedVolunteer = repository.save(volunteer);

        long count = repository.countByRequestId(volunteer.getRequestId());

        HelpRequest request = requestRepository
                .findById(volunteer.getRequestId())
                .orElseThrow();

        request.setVolunteers((int) count);
        requestRepository.save(request);

        return ResponseEntity.ok(Map.of(
                "message", "Volunteer registered successfully",
                "volunteerId", savedVolunteer.getId(),
                "volunteerCount", count
        ));
    }

    // Get volunteers for a request
    @GetMapping("/request/{requestId}")
    public List<Volunteer> getVolunteers(
            @PathVariable Long requestId) {
        return repository.findByRequestId(requestId);
    }

    // Get volunteer count
    @GetMapping("/count/{requestId}")
    public long getVolunteerCount(
            @PathVariable Long requestId) {
        return repository.countByRequestId(requestId);
    }
}
