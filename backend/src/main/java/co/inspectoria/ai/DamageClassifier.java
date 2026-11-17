package co.inspectoria.ai;

/** Puerto del modelo de visión artificial. Hoy hay una simulación; el modelo real implementa esta misma interfaz. */
public interface DamageClassifier {
    ClassificationResult classify(byte[] image, String contentType);
}
