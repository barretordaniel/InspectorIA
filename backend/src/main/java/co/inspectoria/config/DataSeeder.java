package co.inspectoria.config;

import co.inspectoria.domain.*;
import co.inspectoria.repository.InstitutionalUserRepository;
import co.inspectoria.repository.ReportRepository;
import co.inspectoria.service.PhotoStorage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.GradientPaint;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

/** Crea el usuario institucional inicial y, opcionalmente, reportes de ejemplo para la demo. */
@Component
public class DataSeeder implements CommandLineRunner {
    private final InstitutionalUserRepository users; private final ReportRepository reports;
    private final PasswordEncoder encoder; private final PhotoStorage storage;
    @Value("${inspectoria.admin.email}") private String adminEmail;
    @Value("${inspectoria.admin.password}") private String adminPassword;
    @Value("${inspectoria.admin.name}") private String adminName;
    @Value("${inspectoria.seed-demo}") private boolean seedDemo;

    public DataSeeder(InstitutionalUserRepository users, ReportRepository reports, PasswordEncoder encoder, PhotoStorage storage) {
        this.users = users; this.reports = reports; this.encoder = encoder; this.storage = storage;
    }

    @Override
    public void run(String... args) throws Exception {
        if (users.findByEmail(adminEmail.toLowerCase()).isEmpty())
            users.save(new InstitutionalUser(adminEmail.toLowerCase(), encoder.encode(adminPassword), adminName));
        if (seedDemo && reports.count() == 0) seedReports();
    }

    private void seedReports() throws Exception {
        Object[][] d = {
            {DamageType.HUECO, Severity.GRAVE, 92, "Carrera 15 # 93-75", "Chicó Norte · Chapinero", 4.6789, -74.0521, "2026-09-08T10:32", "El hueco está ubicado en el carril derecho y dificulta el paso de vehículos."},
            {DamageType.GRIETA, Severity.MODERADO, 87, "Calle 72 # 10-34", "La Castellana · Chapinero", 4.6712, -74.0598, "2026-09-07T14:15", null},
            {DamageType.HUNDIMIENTO, Severity.GRAVE, 78, "Av. El Dorado # 69-76", "Fontibón", 4.6571, -74.1023, "2026-09-07T09:44", null},
            {DamageType.ANDEN_ROTO, Severity.LEVE, 94, "Calle 100 # 19-52", "Usaquén", 4.6912, -74.0487, "2026-09-06T16:20", null},
            {DamageType.HUECO, Severity.MODERADO, 85, "Carrera 7 # 45-23", "Chapinero", 4.6634, -74.0558, "2026-09-06T11:05", null},
            {DamageType.GRIETA, Severity.LEVE, 91, "Calle 26 # 92-32", "Álamos · Engativá", 4.6481, -74.0963, "2026-09-05T13:30", null},
            {DamageType.HUECO, Severity.GRAVE, 89, "Transversal 39 # 119-20", "Suba", 4.7101, -74.0799, "2026-09-05T08:12", null},
            {DamageType.ANDEN_ROTO, Severity.MODERADO, 83, "Calle 80 # 68-40", "Engativá", 4.6823, -74.0936, "2026-09-04T15:45", null},
        };
        for (int i = d.length - 1; i >= 0; i--) {
            var x = d[i]; var r = new Report();
            r.setCode("INS-2026-%05d".formatted(reports.nextCodeNumber()));
            r.setDamageType((DamageType) x[0]); r.setSeverity((Severity) x[1]); r.setConfidence((Integer) x[2]);
            r.setAddress((String) x[3]); r.setNeighborhood((String) x[4]);
            r.setLatitude((Double) x[5]); r.setLongitude((Double) x[6]);
            r.setCreatedAt(LocalDateTime.parse((String) x[7])); r.setComment((String) x[8]);
            r.setPhotoPath(storage.saveBytes(placeholder(i)));
            reports.save(r);
        }
    }

    /** Imagen de relleno (asfalto gris con una mancha oscura) para que los reportes de ejemplo tengan foto. */
    private byte[] placeholder(int seed) throws Exception {
        var img = new BufferedImage(600, 400, BufferedImage.TYPE_INT_RGB);
        var g = img.createGraphics();
        g.setPaint(new GradientPaint(0, 0, new Color(110, 112, 118), 600, 400, new Color(70, 72, 78)));
        g.fillRect(0, 0, 600, 400);
        g.setColor(new Color(30, 30, 34));
        g.fillOval(180 + seed * 8, 130, 240 - seed * 6, 140);
        g.dispose();
        var out = new ByteArrayOutputStream();
        ImageIO.write(img, "jpg", out);
        return out.toByteArray();
    }
}
