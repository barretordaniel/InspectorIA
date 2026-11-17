package co.inspectoria.repository;

import co.inspectoria.domain.Report;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    @Query("select r from Report r where (:type is null or r.damageTypeId = :type) " +
           "and (:sev is null or r.severityId = :sev) order by r.createdAt desc")
    List<Report> search(@Param("type") Integer type, @Param("sev") Integer sev);

    @Query(value = "select nextval('report_code_seq')", nativeQuery = true)
    long nextCodeNumber();
}
