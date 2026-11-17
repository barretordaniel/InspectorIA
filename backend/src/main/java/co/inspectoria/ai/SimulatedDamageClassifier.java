package co.inspectoria.ai;

import co.inspectoria.domain.DamageType;
import co.inspectoria.domain.Severity;
import org.springframework.stereotype.Component;
import java.security.MessageDigest;

/** Simulación determinista: la misma imagen siempre da el mismo resultado (útil para demos y pruebas). */
@Component
public class SimulatedDamageClassifier implements DamageClassifier {
    @Override
    public ClassificationResult classify(byte[] image, String contentType) {
        try {
            byte[] h = MessageDigest.getInstance("SHA-256").digest(image);
            var type = DamageType.values()[(h[0] & 0xff) % DamageType.values().length];
            var sev = Severity.values()[(h[1] & 0xff) % Severity.values().length];
            int conf = 75 + (h[2] & 0xff) % 22; // 75–96
            return new ClassificationResult(type, sev, conf);
        } catch (Exception e) { throw new IllegalStateException(e); }
    }
}
