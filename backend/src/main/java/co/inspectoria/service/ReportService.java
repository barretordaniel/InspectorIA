package co.inspectoria.service;

import co.inspectoria.ai.*;
import co.inspectoria.domain.*;
import co.inspectoria.dto.StatsDto;
import co.inspectoria.repository.ReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.Year;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class ReportService {
    private final ReportRepository repo; private final DamageClassifier classifier; private final PhotoStorage storage;
    public ReportService(ReportRepository repo, DamageClassifier classifier, PhotoStorage storage) {
        this.repo = repo; this.classifier = classifier; this.storage = storage;
    }

    public ClassificationResult classify(MultipartFile photo) throws IOException {
        return classifier.classify(photo.getBytes(), photo.getContentType());
    }

    @Transactional
    public Report create(MultipartFile photo, double lat, double lng, String address, String neighborhood, String comment) throws IOException {
        var result = classify(photo);
        var r = new Report();
        r.setCode("INS-%d-%05d".formatted(Year.now().getValue(), repo.nextCodeNumber()));
        r.setDamageType(result.type()); r.setSeverity(result.severity()); r.setConfidence(result.confidence());
        r.setAddress(address); r.setNeighborhood(neighborhood); r.setLatitude(lat); r.setLongitude(lng);
        r.setComment(comment); r.setPhotoPath(storage.save(photo));
        return repo.save(r);
    }

    public List<Report> search(String type, String severity, String q, List<Long> ids) {
        Integer t = (type == null || type.isBlank() || type.equals("Todos")) ? null : DamageType.fromLabel(type).id;
        Integer s = (severity == null || severity.isBlank() || severity.equals("Todas")) ? null : Severity.fromLabel(severity).id;
        var stream = repo.search(t, s).stream();
        if (ids != null && !ids.isEmpty()) stream = stream.filter(r -> ids.contains(r.getId()));
        if (q != null && !q.isBlank()) {
            String needle = q.trim().toLowerCase();
            stream = stream.filter(r -> r.getAddress().toLowerCase().contains(needle)
                || (r.getNeighborhood() != null && r.getNeighborhood().toLowerCase().contains(needle)));
        }
        return stream.toList();
    }

    public StatsDto stats() {
        var all = repo.findAll();
        var now = LocalDateTime.now();
        Map<String, Long> byType = new LinkedHashMap<>();
        for (var t : DamageType.values()) byType.put(t.label, all.stream().filter(r -> r.getDamageType() == t).count());
        return new StatsDto(all.size(),
            all.stream().filter(r -> r.getSeverity() == Severity.LEVE).count(),
            all.stream().filter(r -> r.getSeverity() == Severity.MODERADO).count(),
            all.stream().filter(r -> r.getSeverity() == Severity.GRAVE).count(),
            byType,
            all.stream().filter(r -> r.getCreatedAt().isAfter(now.minusDays(7))).count(),
            all.stream().filter(r -> r.getCreatedAt().isAfter(now.minusDays(14)) && !r.getCreatedAt().isAfter(now.minusDays(7))).count());
    }

    public Report get(long id) { return repo.findById(id).orElseThrow(() -> new NoSuchElementException("Reporte " + id)); }
    public byte[] photo(Report r) throws IOException { return storage.read(r.getPhotoPath()); }
}
