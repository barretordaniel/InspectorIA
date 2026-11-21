package co.inspectoria.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.*;
import co.inspectoria.ai.AiUnavailableException;
import co.inspectoria.ai.NoDamageDetectedException;
import java.util.Map;
import java.util.NoSuchElementException;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${inspectoria.cors-origin}") private String origin;
    @Override public void addCorsMappings(CorsRegistry r) { r.addMapping("/api/**").allowedOrigins(origin).allowedMethods("GET", "POST"); }

    @RestControllerAdvice
    static class Errors {
        @ExceptionHandler(NoSuchElementException.class) @ResponseStatus(HttpStatus.NOT_FOUND)
        Map<String, String> notFound(Exception e) { return Map.of("error", e.getMessage()); }
        @ExceptionHandler(NoDamageDetectedException.class) @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
        Map<String, String> noDamage(Exception e) { return Map.of("error", "No detectamos un daño vial en la foto. Acércate y tómala con buena luz."); }
        @ExceptionHandler(AiUnavailableException.class) @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
        Map<String, String> aiDown(Exception e) { return Map.of("error", e.getMessage()); }
        @ExceptionHandler(IllegalArgumentException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
        Map<String, String> bad(Exception e) { return Map.of("error", e.getMessage()); }
    }
}
