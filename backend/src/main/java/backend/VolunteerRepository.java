
package backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {

    List<Volunteer> findByRequestId(Long requestId);

    Optional<Volunteer> findByRequestIdAndUserId(Long requestId, Long userId);

    long countByRequestId(Long requestId);
}
