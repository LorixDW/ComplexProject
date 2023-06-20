package com.complex.server.controllers;

import com.complex.server.model.Event;
import com.complex.server.model.Participant;
import com.complex.server.model.User;
import com.complex.server.requests.AddNotificationData;
import com.complex.server.requests.Date;
import com.complex.server.requests.DateTime;
import com.complex.server.requests.EditNotificationData;
import com.complex.server.responses.NotificationResponse;
import com.complex.server.responses.TextResp;
import com.complex.server.responses.UserResp;
import com.complex.server.services.EventService;
import com.complex.server.services.NotificationService;
import com.complex.server.services.ParticipantsService;
import com.complex.server.services.UserService;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ParticipantsService participantsService;
    @Autowired
    private UserService userService;
    @Autowired
    private EventService eventService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> GetAllNotifications(
            @RequestParam(required = false) Integer eventId,
            @RequestParam(required = false) Boolean deleted,
            @RequestParam(required = false) String email,
            @RequestParam(required = true) Boolean self,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token
    ){
        Event event = null;
        if(eventId != null){
            event = eventService.GetEventById(eventId);
            if(event == null){
                return ResponseEntity.badRequest().body(new TextResp("There are no such event"));
            }
        }
        User user;
        if(self){
            token = token.substring(7);
            user = userService.GetByEmail(jwtUtil.extractUsername(token));
        }else {
            if(email == null){
                return ResponseEntity.badRequest().body(new TextResp("Write needed email"));
            }
            user = userService.GetByEmail(email);
        }
        if(user != null){
            if(deleted == null){
                deleted = false;
            }
            return ResponseEntity.ok(notificationService.GetAll(user, event, deleted).stream().map(n -> new NotificationResponse(
                    n.getId(),
                    n.getParticipant().getEvent().getId(),
                    n.getParticipant().getEvent().getTitle(),
                    n.getDescription(),
                    new Date(n.getDate().getYear(), n.getDate().getMonthValue(), n.getDate().getDayOfMonth()),
                    new DateTime(
                            n.getParticipant().getEvent().getStart().getYear(),
                            n.getParticipant().getEvent().getStart().getMonthValue(),
                            n.getParticipant().getEvent().getStart().getDayOfMonth(),
                            n.getParticipant().getEvent().getStart().getHour(),
                            n.getParticipant().getEvent().getStart().getMinute()
                    ),
                    new DateTime(
                            n.getParticipant().getEvent().getEnd().getYear(),
                            n.getParticipant().getEvent().getEnd().getMonthValue(),
                            n.getParticipant().getEvent().getEnd().getDayOfMonth(),
                            n.getParticipant().getEvent().getEnd().getHour(),
                            n.getParticipant().getEvent().getEnd().getMinute()
                    ),
                    new UserResp(
                            n.getParticipant().getUser().getLName(),
                            n.getParticipant().getUser().getFName(),
                            n.getParticipant().getUser().getPatronymic(),
                            n.getParticipant().getUser().getEmail(),
                            n.getParticipant().getUser().getPhone(),
                            n.getParticipant().getUser().getRole().getName()
                    )
                    )).toList());
        }else {
            return ResponseEntity.badRequest().body(new TextResp("User not found"));
        }
    }

    @PostMapping
    public ResponseEntity<?> AddNotification(
            @RequestBody AddNotificationData data,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token
            ){
        token = token.substring(7);
        User user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user != null){
            if(data.eventId() != null && data.days() != null && data.description() != null){
                Participant participant = participantsService.GetAll(data.eventId()).stream().filter(p -> Objects.equals(p.getUser().getId(), user.getId())).findFirst().orElse(null);
                if(participant == null){
                    return ResponseEntity.status(404).body(new TextResp("There are no such event participant"));
                }
                int code = notificationService.Add(participant, data.description(), data.days());
                if(code == 200){
                    return ResponseEntity.ok(new TextResp("Created"));
                }else {
                    return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
                }
            }else {
                return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
            }
        }else {
            return ResponseEntity.badRequest().body(new TextResp("Something Went Wrong"));
        }
    }

    @PutMapping
    public ResponseEntity<?> EditNotification(@RequestBody EditNotificationData data){
        int code = notificationService.Update(data);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Update"));
        }else if (code == 404){
            return ResponseEntity.status(404).body(new TextResp("There are no such notification"));
        }else {
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> DeleteNotification(@PathVariable(name = "id") Long id){
        if(id == null){
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
        int code = notificationService.Delete(id, true);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Delete"));
        }else {
            return ResponseEntity.status(404).body(new TextResp("There are no such notification"));
        }
    }
    @DeleteMapping("/restore/{id}")
    public ResponseEntity<?> RestoreNotification(@PathVariable(name = "id") Long id){
        if(id == null){
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
        int code = notificationService.Delete(id, false);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Restored"));
        }else {
            return ResponseEntity.status(404).body(new TextResp("There are no such notification"));
        }
    }
}
