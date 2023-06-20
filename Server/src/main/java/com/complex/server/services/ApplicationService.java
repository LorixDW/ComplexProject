package com.complex.server.services;

import com.complex.server.model.*;
import com.complex.server.repositories.ApplicationRepository;
import com.complex.server.repositories.ParticipantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final ParticipantRepository participantRepository;

    public ApplicationService(ApplicationRepository applicationRepository, ParticipantRepository participantRepository) {
        this.applicationRepository = applicationRepository;
        this.participantRepository = participantRepository;
    }

    public List<Application> GetAll(User user, ApplicationType type, Event event, Boolean accepted, boolean deleted){
        List<Application> applications;
        if(type == ApplicationType.APPLICATION){
            if(event != null){
                applications = applicationRepository.findAll().stream().filter(a -> Objects.equals(a.getEvent().getId(), event.getId()) && a.getType() == ApplicationType.APPLICATION).toList();
            }else {
                applications = applicationRepository.findAll().stream().filter(a -> Objects.equals(a.getEvent().getCreator().getId(), user.getId()) && a.getType() == ApplicationType.APPLICATION).toList();
            }
        }else {
            applications = applicationRepository.findAll().stream().filter(a -> Objects.equals(a.getUser().getId(), user.getId()) && a.getType() == ApplicationType.INVITE).toList();
        }
        if(accepted == null){
            return applications.stream().filter(a -> a.getDeleted() == deleted).toList();
        }
        return applications.stream().filter(a -> a.getAccepted() == accepted && a.getDeleted() == deleted).toList();
    }

    public Application GetById(Integer id){
        return applicationRepository.findAll().stream().filter(a -> !a.getDeleted() && Objects.equals(a.getId(), id)).findFirst().orElse(null);
    }
    public Application GetByIdADMIN(Integer id){
        return applicationRepository.findAll().stream().filter(a -> Objects.equals(a.getId(), id)).findFirst().orElse(null);
    }

    public Integer Add(User user, Event event, ApplicationType type, String message){
        if(user != null && event != null && message != null){
            if(applicationRepository.findAll().stream().noneMatch(a -> Objects.equals(a.getUser().getId(), user.getId()) && Objects.equals(a.getEvent().getId(), event.getId()))){
                Application application = new Application(message, false, false, type, user, event);
                applicationRepository.save(application);
                return 200;
            }else {
                return 409;
            }
        }else {
            return 400;
        }
    }

    public Integer Accept(int id, String typeOfParticipant){
        Application application = GetById(id);
        if(application != null){
            if(typeOfParticipant == null ){
                return 400;
            }
            if(application.getAccepted()){
                return 409;
            }
            Participant participant = new Participant(typeOfParticipant, false, application.getUser(), application.getEvent());
            application.setAccepted(true);
            participantRepository.save(participant);
            applicationRepository.save(application);
            return 200;
        }else {
            return 404;
        }
    }

    public Integer Delete(int id, boolean action){
        Application application = GetByIdADMIN(id);
        if(application != null){
            application.setDeleted(action);
            applicationRepository.save(application);
            return 200;
        }else {
            return 404;
        }
    }
}
