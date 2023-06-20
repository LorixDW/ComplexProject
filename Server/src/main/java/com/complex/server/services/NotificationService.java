package com.complex.server.services;

import com.complex.server.model.Event;
import com.complex.server.model.Notification;
import com.complex.server.model.Participant;
import com.complex.server.model.User;
import com.complex.server.repositories.NotificationRepository;
import com.complex.server.requests.EditNotificationData;
import com.complex.server.requests.EditNotificationData;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> GetAll(User user, Event event, boolean deleted){
        List<Notification> notifications;
        if(event != null){
            notifications = notificationRepository.findAll().stream().filter(n -> Objects.equals(n.getParticipant().getEvent().getId(), event.getId()) && Objects.equals(n.getParticipant().getUser().getId(), user.getId())).toList();
        }else {
            notifications = notificationRepository.findAll().stream().filter(n -> Objects.equals(n.getParticipant().getUser().getId(), user.getId())).toList();
        }
        return notifications.stream().filter(n -> n.getDeleted() == deleted).toList();
    }

    public Notification GetById(long id){
        return notificationRepository.findAll().stream().filter(n -> n.getId() == id && !n.getDeleted()).findFirst().orElse(null);
    }

    public Notification GetByIdAdmin(long id){
        return notificationRepository.findAll().stream().filter(n -> n.getId() == id).findFirst().orElse(null);
    }

    public Integer Add(Participant participant, String description, int days){
        if(days > 0 && description != null){
            LocalDate date = LocalDate.of(participant.getEvent().getStart().getYear(), participant.getEvent().getStart().getMonthValue(), participant.getEvent().getStart().getDayOfMonth()).minusDays(days);
            Notification notification = new Notification(description, date, false, participant);
            notificationRepository.save(notification);
            return 200;
        }
        else {
            return 400;
        }
    }

    public Integer Update(EditNotificationData data){
        Notification notification = GetById(data.id());
        if(notification != null){
            if(data.description() != null){
                if(data.days() != null){
                    if (data.days() > 0){
                        LocalDateTime start = notification.getParticipant().getEvent().getStart();
                        LocalDate date = LocalDate.of(start.getYear(), start.getMonthValue(), start.getDayOfMonth()).minusDays(data.days());
                        notification.setDate(date);
                    }
                    else {
                        return 400;
                    }
                }
                notification.setDescription(data.description());
                notificationRepository.save(notification);
                return 200;
            } else {
                return 400;
            }
        } else {
            return 404;
        }
    }

    public Integer Delete(Long id, boolean action){
        Notification notification = GetByIdAdmin(id);
        if (notification != null){
            notification.setDeleted(action);
            notificationRepository.save(notification);
            return 200;
        } else {
            return 404;
        }
    }
}
