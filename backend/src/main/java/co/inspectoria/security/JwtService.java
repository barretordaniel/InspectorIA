package co.inspectoria.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {
    private final SecretKey key; private final long ttlMs;
    public JwtService(@Value("${inspectoria.jwt.secret}") String secret, @Value("${inspectoria.jwt.ttl-hours}") long hours) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttlMs = hours * 3_600_000L;
    }
    public String issue(String email) {
        long now = System.currentTimeMillis();
        return Jwts.builder().subject(email).issuedAt(new Date(now)).expiration(new Date(now + ttlMs)).signWith(key).compact();
    }
    public Optional<String> verify(String token) {
        try { return Optional.ofNullable(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject()); }
        catch (JwtException | IllegalArgumentException e) { return Optional.empty(); }
    }
}
