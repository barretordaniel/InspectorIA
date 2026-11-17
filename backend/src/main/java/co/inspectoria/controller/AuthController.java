package co.inspectoria.controller;

import co.inspectoria.repository.InstitutionalUserRepository;
import co.inspectoria.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    public record LoginRequest(String email, String password) {}

    private final InstitutionalUserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(InstitutionalUserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users; this.encoder = encoder; this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var user = users.findByEmail(req.email() == null ? "" : req.email().trim().toLowerCase());
        if (user.isEmpty() || req.password() == null || !encoder.matches(req.password(), user.get().getPasswordHash()))
            return ResponseEntity.status(401).body(Map.of("error", "Correo o contraseña incorrectos"));
        return ResponseEntity.ok(Map.of("token", jwt.issue(user.get().getEmail()), "name", user.get().getName()));
    }
}
