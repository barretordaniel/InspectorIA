package co.inspectoria.dto;

import java.util.Map;

public record StatsDto(long total, long leve, long moderado, long grave, Map<String, Long> byType, long thisWeek, long prevWeek) {}
