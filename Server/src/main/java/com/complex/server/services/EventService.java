package com.complex.server.services;

import com.complex.server.model.Event;
import com.complex.server.model.Participant;
import com.complex.server.model.Privacy;
import com.complex.server.model.User;
import com.complex.server.repositories.EventRepository;
import com.complex.server.repositories.ParticipantRepository;
import com.complex.server.requests.EditEvent;
import com.complex.server.requests.EventAddForm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;

    @Autowired
    public EventService(EventRepository eventRepository, ParticipantRepository participantRepository){
        this.eventRepository = eventRepository;
        this.participantRepository = participantRepository;
    }

    public List<Event> GetAllEvents(List<Privacy> privacies, boolean deleted){
        List<Event> events = null;
        if(privacies == null){
            events = eventRepository.findAll();
        }
        else {
            events = eventRepository.findAll().stream().filter(event -> privacies.contains(event.getPrivacy())).collect(Collectors.toList());
        }
        return events.stream().filter(event -> event.getDeleted() == deleted).toList();
    }
    public Integer AddEvent(EventAddForm event, User user){
        if(event.title() != null && event.summary() != null && event.description() != null && event.place() != null && event.privacy() != null && event.start() != null && event.end() != null &&
        event.start().year() != null && event.start().month() != null && event.start().day() != null && event.start().hour() != null && event.start().minute() != null &&
        event.end().year() != null && event.end().month() != null && event.end().day() != null && event.end().hour() != null && event.end().minute() != null){
            LocalDateTime start = LocalDateTime.of(event.start().year(), event.start().month(), event.start().day(), event.start().hour(), event.start().minute());
            LocalDateTime end = LocalDateTime.of(event.end().year(), event.end().month(), event.end().day(), event.end().hour(), event.end().minute());
            if(start.isBefore(end)){
                Event eventCreated = new Event(
                        event.title(),
                        event.summary(),
                        event.description(),
                        event.place(),
                        start,
                        end,
                        event.privacy(),
                        false,
                        user
                );
                eventRepository.save(eventCreated);
                participantRepository.save(new Participant("Владелец", false, user, eventCreated));
                return 200;
            }
            else {
                return 409;
            }
        }
        else {
            return 400;
        }
    }
    public Event GetEventById(Integer id){
        return eventRepository.findAll().stream().filter(event -> Objects.equals(event.getId(), id) && !event.getDeleted()).findFirst().orElse(null);
    }
    public Event GetEventByIdADMIN(Integer id){
        return eventRepository.findAll().stream().filter(event -> Objects.equals(event.getId(), id)).findFirst().orElse(null);
    }
    public Integer UpdateEvent(EditEvent data){
        if(data.id() != null && data.title() != null && data.summary() != null && data.description() != null && data.place() != null &&
        data.start().year() != null && data.start().month() != null && data.start().day() != null && data.start().hour()  != null && data.start().minute()  != null &&
        data.end().year() != null && data.end().month() != null && data.end().day() != null && data.end().hour() != null && data.end().minute() != null){
            Event event = GetEventById(data.id());
            if(event != null){
                LocalDateTime start = LocalDateTime.of(data.start().year(), data.start().month(), data.start().day(), data.start().hour(), data.start().minute());
                LocalDateTime end = LocalDateTime.of(data.end().year(), data.end().month(), data.end().day(), data.end().hour(), data.end().minute());
                if(start.isBefore(end)){
                    event.setTitle(data.title());
                    event.setSummary(data.summary());
                    event.setDescription(data.description());
                    event.setEnd(end);
                    event.setStart(start);
                    if(data.place() != null){
                        event.setPlace(data.place());
                    }
                    eventRepository.save(event);
                    return 200;
                }else {
                    return 409;
                }
            }
            else {
                return 404;
            }
        }
        else {
            return 400;
        }
    }
    public Integer DeleteEvent(Integer id, boolean action){
        Event event = GetEventByIdADMIN(id);
        if(event != null){
            event.setDeleted(action);
            eventRepository.save(event);
            return 200;
        }
        else {
            return 404;
        }
    }
}
