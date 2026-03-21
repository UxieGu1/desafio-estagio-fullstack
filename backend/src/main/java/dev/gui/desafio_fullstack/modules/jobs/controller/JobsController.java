package dev.gui.desafio_fullstack.modules.jobs.controller;

import dev.gui.desafio_fullstack.modules.jobs.dto.JobsRequest;
import dev.gui.desafio_fullstack.modules.jobs.dto.JobsResponse;
import dev.gui.desafio_fullstack.modules.jobs.service.JobsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobsController {

    private final JobsService jobsService;

    @PostMapping
    public ResponseEntity<JobsResponse> createJob(@RequestBody @Valid JobsRequest jobsRequest){

        JobsResponse jobsResponse = jobsService.createJob(jobsRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(jobsResponse);
    }

    @GetMapping
    public ResponseEntity<Page<JobsResponse>> listJobs(@PageableDefault(size = 10, sort = "id") Pageable pageable){

        Page<JobsResponse> jobsList = jobsService.listJobs(pageable);

        return ResponseEntity.ok(jobsList);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobsResponse> findJobById(@PathVariable("jobId") Long jobId){

        JobsResponse jobById = jobsService.findJobById(jobId);

        return ResponseEntity.ok(jobById);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobsResponse> updateJob(@PathVariable("jobId") Long jobId, @RequestBody @Valid JobsRequest jobsRequest) {

        JobsResponse updatedJob = jobsService.updateJob(jobId, jobsRequest);

        return ResponseEntity.ok(updatedJob);
    }

    @PatchMapping("/{jobId}/close")
    public ResponseEntity<Void> closeJob(@PathVariable Long jobId) {

        jobsService.closeJob(jobId);

        return ResponseEntity.noContent().build();
    }
}