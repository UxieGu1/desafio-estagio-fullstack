package dev.gui.desafio_fullstack.modules.jobs.repository;

import dev.gui.desafio_fullstack.modules.jobs.entity.Job;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends CrudRepository<Job, Long>, PagingAndSortingRepository<Job, Long> {


    @Modifying
    @Query("UPDATE jobs SET status = 'CLOSED' WHERE id = :id")
    void closeJobsById(@Param("id") Long id);

    @Query("SELECT COUNT(*) FROM jobs WHERE status = 'OPEN'")
    long countOpenJobs();
}