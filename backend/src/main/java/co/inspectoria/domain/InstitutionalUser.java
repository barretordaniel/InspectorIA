package co.inspectoria.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "institutional_user")
public class InstitutionalUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String email;
    @Column(name = "password_hash", nullable = false) private String passwordHash;
    @Column(nullable = false) private String name;

    protected InstitutionalUser() {}
    public InstitutionalUser(String email, String passwordHash, String name) { this.email = email; this.passwordHash = passwordHash; this.name = name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getName() { return name; }
}
