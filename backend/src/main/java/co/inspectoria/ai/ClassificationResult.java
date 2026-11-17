package co.inspectoria.ai;

import co.inspectoria.domain.DamageType;
import co.inspectoria.domain.Severity;

public record ClassificationResult(DamageType type, Severity severity, int confidence) {}
