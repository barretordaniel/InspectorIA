package co.inspectoria.service;

import co.inspectoria.domain.Report;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class PdfService {
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("d 'de' MMMM yyyy, HH:mm", new Locale("es", "CO"));

    public byte[] build(Report r, byte[] photo) {
        try (var out = new ByteArrayOutputStream()) {
            var doc = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(doc, out); doc.open();
            var h1 = new Font(Font.HELVETICA, 20, Font.BOLD, new Color(15, 35, 86));
            var h2 = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(15, 35, 86));
            var body = new Font(Font.HELVETICA, 10); var small = new Font(Font.HELVETICA, 8, Font.ITALIC, Color.GRAY);

            doc.add(new Paragraph("InspectorIA — Reporte de daño vial", h1));
            doc.add(new Paragraph("Código: " + r.getCode() + "   |   " + r.getCreatedAt().format(FMT), body));
            doc.add(Chunk.NEWLINE);
            var img = Image.getInstance(photo); img.scaleToFit(480, 300); doc.add(img);
            doc.add(Chunk.NEWLINE);

            var t = new PdfPTable(2); t.setWidthPercentage(100);
            row(t, "Tipo de daño", r.getDamageType().label, h2, body);
            row(t, "Severidad estimada", r.getSeverity().label, h2, body);
            row(t, "Confianza de la IA", r.getConfidence() + "%", h2, body);
            row(t, "Dirección", r.getAddress() + (r.getNeighborhood() != null ? " — " + r.getNeighborhood() : ""), h2, body);
            row(t, "Coordenadas", "%.5f, %.5f".formatted(r.getLatitude(), r.getLongitude()), h2, body);
            if (r.getComment() != null && !r.getComment().isBlank()) row(t, "Comentario del ciudadano", r.getComment(), h2, body);
            doc.add(t);

            doc.add(Chunk.NEWLINE);
            doc.add(new Paragraph("La clasificación y severidad corresponden a una estimación preliminar realizada mediante " +
                "inteligencia artificial y no reemplazan una inspección técnica.", small));
            doc.close();
            return out.toByteArray();
        } catch (Exception e) { throw new IllegalStateException("No se pudo generar el PDF", e); }
    }

    private void row(PdfPTable t, String k, String v, Font kf, Font vf) {
        var a = new PdfPCell(new Phrase(k, kf)); a.setBorderColor(Color.LIGHT_GRAY); a.setPadding(6); t.addCell(a);
        var b = new PdfPCell(new Phrase(v, vf)); b.setBorderColor(Color.LIGHT_GRAY); b.setPadding(6); t.addCell(b);
    }
}
