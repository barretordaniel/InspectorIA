package co.inspectoria.repository;

import co.inspectoria.domain.InstitutionalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InstitutionalUserRepository extends JpaRepository<InstitutionalUser, Long> {
    Optional<InstitutionalUser> findByEmail(String email);
}
