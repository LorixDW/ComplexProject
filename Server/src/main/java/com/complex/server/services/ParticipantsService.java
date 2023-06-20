package com.complex.server.services;

import com.complex.server.model.Event;
import com.complex.server.model.Participant;
import com.complex.server.model.User;
import com.complex.server.repositories.ParticipantRepository;
import com.complex.server.requests.EditParticipantData;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ParticipantsService {

    private final ParticipantRepository participantRepository;

    public ParticipantsService(ParticipantRepository participantRepository) {
        this.participantRepository = participantRepository;
    }

    public List<Participant> GetAll(Integer EventId){
        return participantRepository.findAll().stream().filter(p -> Objects.equals(p.getEvent().getId(), EventId) && !p.getDeleted()).toList();
    }
    public List<Participant> GetAllDeleted(Integer EventId){
        return participantRepository.findAll().stream().filter(p -> Objects.equals(p.getEvent().getId(), EventId) && p.getDeleted()).toList();
    }

    public Participant GetById(Long id){
        return participantRepository.findAll().stream().filter(p -> Objects.equals(p.getId(), id) && !p.getDeleted()).findFirst().orElse(null);
    }
    public Participant GetByIdADMIN(Long id){
        return participantRepository.findAll().stream().filter(p -> Objects.equals(p.getId(), id)).findFirst().orElse(null);
    }

    public Integer Add(Event event, User user, String type){
        if(GetAll(event.getId()).stream().noneMatch(p -> Objects.equals(p.getUser().getId(), user.getId()))){
            Participant participant = new Participant(type, false, user ,event);
            participantRepository.save(participant);
            return 200;
        }else {
            return 409;
        }
    }

    public Integer Update(EditParticipantData data){
        Participant participant = GetById(data.id());
        if (participant != null){
            if(data.type() != null){
                participant.setType(data.type());
                participantRepository.save(participant);
                return 200;
            }else {
                return 400;
            }
        } else {
            return 404;
        }
    }

    public Integer Delete(Long id, boolean action){
        Participant participant = GetByIdADMIN(id);
        if(participant != null){
            participant.setDeleted(action);
            participantRepository.save(participant);
            return 200;
        }else {
            return 404;
        }
    }
}
