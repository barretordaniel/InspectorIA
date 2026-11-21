package co.inspectoria.ai;

public class NoDamageDetectedException extends RuntimeException {
    public NoDamageDetectedException() { super("No se detectó daño vial"); }
}
