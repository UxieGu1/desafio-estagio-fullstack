package dev.gui.team_guide.modules.jobs.repository;

import dev.gui.team_guide.modules.jobs.dto.JobAppCountDTO;
import dev.gui.team_guide.modules.jobs.dto.StatusCountDTO;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.mapper.JobAppCountMapper;
import dev.gui.team_guide.modules.jobs.mapper.StatusCountMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends CrudRepository<Job, Long>, PagingAndSortingRepository<Job, Long> {


    @Modifying
    @Query("UPDATE jobs SET status = 'CLOSED' WHERE id = :id")
    void closeJobsById(@Param("id") Long id);

    @Query("SELECT COUNT(*) FROM jobs WHERE status = 'OPEN'")
    Long countOpenJobs();

    Page<Job> findByTitleContainingIgnoreCase(String title, Pageable pageable);


    // Consulta 1: Agrupamento Simples
    @Query(value = "SELECT status AS status, COUNT(id) AS total " +
            "FROM jobs " +
            "GROUP BY status",
            rowMapperClass = StatusCountMapper.class) // <-- O Segredo está aqui!
    List<StatusCountDTO> countJobsByStatus();

    // Consulta 2: JOIN, GROUP BY e ORDER BY
    @Query(value = "SELECT j.title AS title, COUNT(a.id) AS total " +
            "FROM jobs j " +
            "LEFT JOIN applications a ON j.id = a.job_id " +
            "GROUP BY j.title " +
            "ORDER BY total DESC " +
            "LIMIT 5",
            rowMapperClass = JobAppCountMapper.class)
    List<JobAppCountDTO> countApplicationsPerJob();
}