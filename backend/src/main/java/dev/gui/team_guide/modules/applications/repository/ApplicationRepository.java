package dev.gui.team_guide.modules.applications.repository;

import dev.gui.team_guide.modules.applications.entity.Application;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ApplicationRepository extends CrudRepository<Application, Long> {


    List<Application> findAllByJobId(Long jobId);

}
