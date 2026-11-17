package co.inspectoria.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report")
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String code;
    @Column(name = "damage_type_id", nullable = false) private int damageTypeId;
    @Column(name = "severity_id", nullable = false) private int severityId;
    @Column(nullable = false) private int confidence;
    @Column(nullable = false) private String address;
    private String neighborhood;
    @Column(nullable = false) private double latitude;
    @Column(nullable = false) private double longitude;
    private String comment;
    @Column(name = "photo_path", nullable = false) private String photoPath;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getCode() { return code; } public void setCode(String v) { code = v; }
    public DamageType getDamageType() { return DamageType.fromId(damageTypeId); }
    public void setDamageType(DamageType t) { damageTypeId = t.id; }
    public Severity getSeverity() { return Severity.fromId(severityId); }
    public void setSeverity(Severity s) { severityId = s.id; }
    public int getConfidence() { return confidence; } public void setConfidence(int v) { confidence = v; }
    public String getAddress() { return address; } public void setAddress(String v) { address = v; }
    public String getNeighborhood() { return neighborhood; } public void setNeighborhood(String v) { neighborhood = v; }
    public double getLatitude() { return latitude; } public void setLatitude(double v) { latitude = v; }
    public double getLongitude() { return longitude; } public void setLongitude(double v) { longitude = v; }
    public String getComment() { return comment; } public void setComment(String v) { comment = v; }
    public String getPhotoPath() { return photoPath; } public void setPhotoPath(String v) { photoPath = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
}
