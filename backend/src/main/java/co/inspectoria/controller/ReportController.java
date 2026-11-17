package co.inspectoria.controller;

import co.inspectoria.dto.*;
import co.inspectoria.service.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReportController {
    private final ReportService reports; private final PdfService pdf;
    public ReportController(ReportService reports, PdfService pdf) { this.reports = reports; this.pdf = pdf; }

    /** Paso "Analizando": clasifica sin guardar. */
    @PostMapping(value = "/classify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ClassificationDto classify(@RequestParam MultipartFile photo) throws IOException {
        return ClassificationDto.from(reports.classify(photo));
    }

    @PostMapping(value = "/reports", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ReportDto create(@RequestParam MultipartFile photo, @RequestParam double lat, @RequestParam double lng,
                            @RequestParam String address, @RequestParam(required = false) String neighborhood,
                            @RequestParam(required = false) String comment) throws IOException {
        return ReportDto.from(reports.create(photo, lat, lng, address, neighborhood, comment));
    }

    @GetMapping("/reports")
    public List<ReportDto> list(@RequestParam(required = false) String type, @RequestParam(required = false) String severity,
                                @RequestParam(required = false) String q, @RequestParam(required = false) List<Long> ids) {
        return reports.search(type, severity, q, ids).stream().map(ReportDto::from).toList();
    }

    /** Solo para usuarios institucionales (requiere JWT). */
    @GetMapping("/inst/stats")
    public StatsDto stats() { return reports.stats(); }

    @GetMapping("/reports/{id}")
    public ReportDto get(@PathVariable long id) { return ReportDto.from(reports.get(id)); }

    @GetMapping("/reports/{id}/photo")
    public ResponseEntity<byte[]> photo(@PathVariable long id) throws IOException {
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(reports.photo(reports.get(id)));
    }

    @GetMapping("/reports/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable long id) throws IOException {
        var r = reports.get(id);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + r.getCode() + ".pdf\"")
            .body(pdf.build(r, reports.photo(r)));
    }
}
