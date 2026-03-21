package dev.gui.desafio_fullstack.modules.applications.repository;

import dev.gui.desafio_fullstack.modules.applications.entity.Application;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ApplicationRepository extends CrudRepository<Application, Long> {


    List<Application> findAllByJobId(Long jobId);

}
