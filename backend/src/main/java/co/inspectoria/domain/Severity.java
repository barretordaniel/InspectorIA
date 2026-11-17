package co.inspectoria.domain;

public enum Severity {
    LEVE(1, "leve"), MODERADO(2, "moderado"), GRAVE(3, "grave");
    public final int id; public final String label;
    Severity(int id, String label) { this.id = id; this.label = label; }
    public static Severity fromId(int id) { for (var s : values()) if (s.id == id) return s; throw new IllegalArgumentException("severidad " + id); }
    public static Severity fromLabel(String l) { for (var s : values()) if (s.label.equalsIgnoreCase(l)) return s; throw new IllegalArgumentException("severidad " + l); }
}
