package co.inspectoria.ai;

import co.inspectoria.domain.DamageType;
import co.inspectoria.domain.Severity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/** Llama al servicio Python (YOLOv8). Se activa con inspectoria.classifier=remote. */
@Component
@ConditionalOnProperty(name = "inspectoria.classifier", havingValue = "remote")
public class RemoteDamageClassifier implements DamageClassifier {
    public record Resp(String type, String severity, int confidence) {}

    private final RestClient http;

    public RemoteDamageClassifier(@Value("${inspectoria.ai.url}") String url) {
        var f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(3000);
        f.setReadTimeout(30000);
        this.http = RestClient.builder().baseUrl(url).requestFactory(f).build();
    }

    @Override
    public ClassificationResult classify(byte[] image, String contentType) {
        var body = new LinkedMultiValueMap<String, Object>();
        body.add("photo", new ByteArrayResource(image) {
            @Override public String getFilename() { return "foto.jpg"; }
        });
        try {
            var r = http.post().uri("/classify").contentType(MediaType.MULTIPART_FORM_DATA).body(body).retrieve().body(Resp.class);
            return new ClassificationResult(DamageType.fromLabel(r.type()), Severity.fromLabel(r.severity()), r.confidence());
        } catch (HttpClientErrorException.UnprocessableEntity e) {
            throw new NoDamageDetectedException();
        } catch (RestClientException e) {
            throw new AiUnavailableException("El servicio de IA no está disponible", e);
        }
    }
}
