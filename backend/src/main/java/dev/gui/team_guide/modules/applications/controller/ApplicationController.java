package dev.gui.team_guide.modules.applications.controller;

import dev.gui.team_guide.modules.applications.dto.ApplicationRequest;
import dev.gui.team_guide.modules.applications.dto.ApplicationResponse;
import dev.gui.team_guide.modules.applications.dto.UpdateStatusRequest;
import dev.gui.team_guide.modules.applications.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;


    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody ApplicationRequest request) {
        ApplicationResponse createdApplication = applicationService.createApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdApplication);
    }

    @GetMapping("/jobs/{jobsId}")
    public ResponseEntity<List<ApplicationResponse>> listApplicationsbyJob(@PathVariable Long jobsId) {
        List<ApplicationResponse> application = applicationService.listApplicationsbyJob(jobsId);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        ApplicationResponse application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequest request) {

        ApplicationResponse updatedApplication = applicationService.updateApplication(id, request);
        return ResponseEntity.ok(updatedApplication);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        ApplicationResponse updatedApplication = applicationService.updateApplicationStatus(id, request.status());
        return ResponseEntity.ok(updatedApplication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);

        return ResponseEntity.noContent().build();
    }
}