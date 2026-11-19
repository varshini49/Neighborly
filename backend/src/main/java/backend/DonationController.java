
package backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationRepository repository;

    public DonationController(DonationRepository repository) {
        this.repository = repository;
    }

    // Get all donations
    @GetMapping
    public List<Donation> getAllDonations() {
        return repository.findAll();
    }

    // Create donation
    @PostMapping
    public Donation createDonation(@RequestBody Donation donation) {
        return repository.save(donation);
    }

    // Get donations by user
    @GetMapping("/user/{userId}")
    public List<Donation> getUserDonations(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    // Update donation
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonation(
            @PathVariable Long id,
            @RequestBody Donation updatedDonation) {

        return repository.findById(id)
                .map(donation -> {
                    donation.setItem(updatedDonation.getItem());
                    donation.setDescription(updatedDonation.getDescription());
                    donation.setStatus(updatedDonation.getStatus());

                    Donation savedDonation = repository.save(donation);
                    return ResponseEntity.ok(savedDonation);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete donation
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonation(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.ok("Donation deleted successfully");
    }
}
