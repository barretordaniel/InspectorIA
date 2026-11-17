package co.inspectoria.dto;

import co.inspectoria.ai.ClassificationResult;

public record ClassificationDto(String type, String severity, int confidence) {
    public static ClassificationDto from(ClassificationResult r) {
        return new ClassificationDto(r.type().label, r.severity().label, r.confidence());
    }
}
