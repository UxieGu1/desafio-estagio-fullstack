package dev.gui.team_guide.modules.applications.service;

import dev.gui.team_guide.core.exception.BusinessRuleException;
import dev.gui.team_guide.core.exception.ResourceNotFoundException;
import dev.gui.team_guide.modules.applications.dto.ApplicationRequest;
import dev.gui.team_guide.modules.applications.dto.ApplicationResponse;
import dev.gui.team_guide.modules.applications.entity.Application;
import dev.gui.team_guide.modules.applications.mapper.ApplicationMapper;
import dev.gui.team_guide.modules.applications.repository.ApplicationRepository;
import dev.gui.team_guide.modules.jobs.entity.Job;
import dev.gui.team_guide.modules.jobs.enums.JobStatusEnum;
import dev.gui.team_guide.modules.jobs.repository.JobRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ApplicationMapper applicationMapper;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @Test
    @DisplayName("Deve criar candidatura com sucesso em vaga ABERTA")
    void createApplication_ShouldSucceed_WhenJobIsOpen() {
        // Arrange
        ApplicationRequest request = mock(ApplicationRequest.class);
        when(request.jobId()).thenReturn(1L);

        Job openJob = new Job();
        openJob.setId(1L);
        openJob.setStatus(JobStatusEnum.OPEN); // Vaga Aberta!

        Application applicationEntity = new Application();
        Application savedApplication = new Application();
        ApplicationResponse response = mock(ApplicationResponse.class);

        when(jobRepository.findById(1L)).thenReturn(Optional.of(openJob));
        when(applicationMapper.toEntity(request)).thenReturn(applicationEntity);
        when(applicationRepository.save(applicationEntity)).thenReturn(savedApplication);
        when(applicationMapper.toResponse(savedApplication)).thenReturn(response);

        // Act
        ApplicationResponse result = applicationService.createApplication(request);

        // Assert
        assertNotNull(result);
        verify(applicationRepository, times(1)).save(applicationEntity);
    }

    @Test
    @DisplayName("NÃO deve permitir candidatura em vaga FECHADA (Regra de Negócio)")
    void createApplication_ShouldThrowException_WhenJobIsClosed() {
        // Arrange
        ApplicationRequest request = mock(ApplicationRequest.class);
        when(request.jobId()).thenReturn(1L);

        Job closedJob = new Job();
        closedJob.setId(1L);
        closedJob.setStatus(JobStatusEnum.CLOSED); // Vaga Fechada!

        when(jobRepository.findById(1L)).thenReturn(Optional.of(closedJob));

        // Act & Assert
        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> {
            applicationService.createApplication(request);
        });

        assertEquals("It is not possible to apply for a closed position.", exception.getMessage());

        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Deve lançar exceção se a vaga não for encontrada ao criar candidatura")
    void createApplication_ShouldThrowException_WhenJobNotFound() {
        // Arrange
        ApplicationRequest request = mock(ApplicationRequest.class);
        when(request.jobId()).thenReturn(99L);

        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        // AQUI: Usando a tua exceção customizada ResourceNotFoundException
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            applicationService.createApplication(request);
        });

        assertEquals("Job posting not found with ID: 99", exception.getMessage());
    }
}