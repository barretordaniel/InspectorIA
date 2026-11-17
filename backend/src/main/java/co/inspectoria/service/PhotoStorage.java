package co.inspectoria.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class PhotoStorage {
    private final Path dir;
    public PhotoStorage(@Value("${inspectoria.storage-dir}") String d) throws IOException {
        dir = Paths.get(d).toAbsolutePath().normalize(); Files.createDirectories(dir);
    }
    public String save(MultipartFile f) throws IOException {
        String name = UUID.randomUUID() + ".jpg";
        Files.write(dir.resolve(name), f.getBytes());
        return name;
    }
    public String saveBytes(byte[] data) throws IOException {
        String name = UUID.randomUUID() + ".jpg";
        Files.write(dir.resolve(name), data);
        return name;
    }
    public byte[] read(String name) throws IOException {
        Path p = dir.resolve(name).normalize();
        if (!p.startsWith(dir)) throw new IOException("ruta inválida");
        return Files.readAllBytes(p);
    }
}
