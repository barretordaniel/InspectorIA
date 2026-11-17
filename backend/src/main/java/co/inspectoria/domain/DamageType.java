package co.inspectoria.domain;

public enum DamageType {
    HUECO(1, "Hueco"), GRIETA(2, "Grieta"), HUNDIMIENTO(3, "Hundimiento"), ANDEN_ROTO(4, "Andén roto");
    public final int id; public final String label;
    DamageType(int id, String label) { this.id = id; this.label = label; }
    public static DamageType fromId(int id) { for (var t : values()) if (t.id == id) return t; throw new IllegalArgumentException("tipo " + id); }
    public static DamageType fromLabel(String l) { for (var t : values()) if (t.label.equalsIgnoreCase(l)) return t; throw new IllegalArgumentException("tipo " + l); }
}
