package dev.gui.team_guide.modules.jobs.controller;

import dev.gui.team_guide.modules.jobs.dto.JobAppCountDTO;
import dev.gui.team_guide.modules.jobs.dto.JobRequest;
import dev.gui.team_guide.modules.jobs.dto.JobResponse;
import dev.gui.team_guide.modules.jobs.dto.StatusCountDTO;
import dev.gui.team_guide.modules.jobs.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@RequestBody @Valid JobRequest jobRequest){

        JobResponse jobResponse = jobService.createJob(jobRequest);

        return ResponseEntity.status(HttpStatus.CREATED).body(jobResponse);
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> listJobs(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String title) {

        Page<JobResponse> jobs = jobService.listJobs(page, size, title);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobResponse> findJobById(@PathVariable("jobId") Long jobId){

        JobResponse jobById = jobService.findJobById(jobId);

        return ResponseEntity.ok(jobById);
    }

    @GetMapping("/dashboard/open-count")
    public ResponseEntity<Long> getOpenJobsCount() {
        long count = jobService.countOpenJobs();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/dashboard/status")
    public ResponseEntity<List<StatusCountDTO>> getStatusCount() {
        return ResponseEntity.ok(jobService.getDashboardStatusCount());
    }

    @GetMapping("/dashboard/applications-count")
    public ResponseEntity<List<JobAppCountDTO>> getApplicationCount() {
        return ResponseEntity.ok(jobService.getDashboardApplicationCount());
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobResponse> updateJob(@PathVariable("jobId") Long jobId, @RequestBody @Valid JobRequest jobRequest) {

        JobResponse updatedJob = jobService.updateJob(jobId, jobRequest);

        return ResponseEntity.ok(updatedJob);
    }

    @PatchMapping("/{jobId}/close")
    public ResponseEntity<Void> closeJob(@PathVariable Long jobId) {

        jobService.closeJob(jobId);

        return ResponseEntity.noContent().build();
    }
}