package dev.gui.team_guide.modules.applications.ensurer;

import dev.gui.team_guide.core.exception.ResourceNotFoundException;
import dev.gui.team_guide.modules.applications.entity.Application;
import dev.gui.team_guide.modules.applications.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationEnsurer {

    private final ApplicationRepository applicationRepository;

    public Application ensureApplicationExists(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
    }
}
