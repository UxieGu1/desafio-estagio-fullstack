package dev.gui.team_guide.modules.jobs.service;

import dev.gui.team_guide.modules.jobs.dto.JobRequest;
import dev.gui.team_guide.modules.jobs.dto.JobResponse;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.mapper.JobMapper;
import dev.gui.team_guide.modules.jobs.repository.JobRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private JobMapper jobMapper;

    @InjectMocks
    private JobService jobService;

    @Test
    @DisplayName("Deve criar uma vaga com sucesso")
    void createJob_ShouldReturnJobResponse() {
        // Arrange
        JobRequest request = mock(JobRequest.class);
        Job jobEntity = new Job();
        Job savedJob = new Job();
        savedJob.setId(1L);
        JobResponse response = mock(JobResponse.class);

        when(jobMapper.toEntity(request)).thenReturn(jobEntity);
        when(jobRepository.save(jobEntity)).thenReturn(savedJob);
        when(jobMapper.toResponse(savedJob)).thenReturn(response);

        // Act
        JobResponse result = jobService.createJob(request);

        // Assert
        assertNotNull(result);
        verify(jobRepository, times(1)).save(jobEntity);
    }

    @Test
    @DisplayName("Deve retornar a vaga quando o ID existir")
    void findJobById_ShouldReturnJob_WhenIdExists() {
        // Arrange
        Long jobId = 1L;
        Job job = new Job();
        job.setId(jobId);
        JobResponse response = mock(JobResponse.class);

        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(jobMapper.toResponse(job)).thenReturn(response);

        // Act
        JobResponse result = jobService.findJobById(jobId);

        // Assert
        assertNotNull(result);
        verify(jobRepository, times(1)).findById(jobId);
    }

    @Test
    @DisplayName("Deve lançar exceção ao buscar vaga por ID inexistente")
    void findJobById_ShouldThrowException_WhenIdDoesNotExist() {
        // Arrange
        Long jobId = 99L;
        when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> jobService.findJobById(jobId));
        assertEquals("Job posting not found with ID: 99", exception.getMessage());
    }
}