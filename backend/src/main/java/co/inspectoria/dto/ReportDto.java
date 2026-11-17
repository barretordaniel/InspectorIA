package co.inspectoria.dto;

import co.inspectoria.domain.Report;

public record ReportDto(Long id, String code, String type, String severity, int confidence, String address,
                        String neighborhood, double lat, double lng, String date, String comment, String photoUrl) {
    public static ReportDto from(Report r) {
        return new ReportDto(r.getId(), r.getCode(), r.getDamageType().label, r.getSeverity().label, r.getConfidence(),
            r.getAddress(), r.getNeighborhood(), r.getLatitude(), r.getLongitude(), r.getCreatedAt().toString(),
            r.getComment(), "/api/reports/" + r.getId() + "/photo");
    }
}
