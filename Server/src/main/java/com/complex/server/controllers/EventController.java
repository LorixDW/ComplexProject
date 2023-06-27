package com.complex.server.controllers;

import com.complex.server.model.Event;
import com.complex.server.model.Privacy;
import com.complex.server.model.User;
import com.complex.server.requests.DateTime;
import com.complex.server.requests.EditEvent;
import com.complex.server.requests.EventAddForm;
import com.complex.server.responses.EventResp;
import com.complex.server.responses.TextResp;
import com.complex.server.responses.UserResp;
import com.complex.server.services.EventService;
import com.complex.server.services.ParticipantsService;
import com.complex.server.services.UserService;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/event")
public class EventController {
    private EventService eventService;
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ParticipantsService participantsService;
    @Autowired
    public EventController(EventService eventService, UserService userService){
        this.eventService = eventService;
        this.userService = userService;
    }
    @GetMapping("/all")
    public ResponseEntity<?> GetAll(
            @RequestParam(required = false) List<Privacy> types,
            @RequestParam(required = true) Boolean self,
            @RequestParam(required = false) Boolean deleted,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token
            ){
        if(deleted == null){
            deleted = false;
        }
        List<Event> events = new ArrayList<>();
        User user;
        token = token.substring(7);
        user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user == null){
            return ResponseEntity.status(400).body("Something went wrong");
        }
        if(self){
            events = eventService.GetAllEvents(types, deleted).stream().filter(event -> Objects.equals(event.getCreator().getId(), user.getId()) || participantsService.GetAll(event.getId()).stream().anyMatch(part -> Objects.equals(part.getUser().getId(), user.getId()))).toList();
        }
        else {
            events = eventService.GetAllEvents(types, deleted);
        }
        return ResponseEntity.ok(events.stream().map(event -> new EventResp(
                event.getId(),
                event.getTitle(),
                event.getSummary(),
                event.getDescription(),
                event.getPlace(),
                new DateTime(
                        event.getStart().getYear(),
                        event.getStart().getMonthValue(),
                        event.getStart().getDayOfMonth(),
                        event.getStart().getHour(),
                        event.getStart().getMinute()
                ),
                new DateTime(
                        event.getEnd().getYear(),
                        event.getEnd().getMonthValue(),
                        event.getEnd().getDayOfMonth(),
                        event.getEnd().getHour(),
                        event.getEnd().getMinute()
                ),
                event.getPrivacy(),
                new UserResp(
                        event.getCreator().getLName(),
                        event.getCreator().getFName(),
                        event.getCreator().getPatronymic(),
                        event.getCreator().getEmail(),
                        event.getCreator().getPhone(),
                        event.getCreator().getRole().getName()
                ),
                Objects.equals(user.getId(), event.getCreator().getId())
        )).toList());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> GetEvent(@PathVariable(name = "id") int id, @RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        User user;
        token = token.substring(7);
        user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user == null){
            return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
        }
        Event event = eventService.GetEventById(id);
        if(event != null){
            return ResponseEntity.ok(new EventResp(
                    event.getId(),
                    event.getTitle(),
                    event.getSummary(),
                    event.getDescription(),
                    event.getPlace(),
                    new DateTime(
                            event.getStart().getYear(),
                            event.getStart().getMonthValue(),
                            event.getStart().getDayOfMonth(),
                            event.getStart().getHour(),
                            event.getStart().getMinute()
                    ),
                    new DateTime(
                            event.getEnd().getYear(),
                            event.getEnd().getMonthValue(),
                            event.getEnd().getDayOfMonth(),
                            event.getEnd().getHour(),
                            event.getEnd().getMinute()
                    ),
                    event.getPrivacy(),
                    new UserResp(
                            event.getCreator().getLName(),
                            event.getCreator().getFName(),
                            event.getCreator().getPatronymic(),
                            event.getCreator().getEmail(),
                            event.getCreator().getPhone(),
                            event.getCreator().getRole().getName()
                    ),
                    Objects.equals(event.getCreator().getId(), user.getId())
            ));
        }
        else {
            return ResponseEntity.status(404).body(new TextResp("Event not found"));
        }
    }
    @PostMapping
    public ResponseEntity<?> AddEvent(@RequestBody EventAddForm form,
                                      @RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        token = token.substring(7);
        User user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user != null){
            int code = eventService.AddEvent(form, user);
            if(code == 200){
                return ResponseEntity.ok(new TextResp("Created"));
            }
            else if (code == 409){
                return ResponseEntity.status(code).body(new TextResp("Start must be before end"));
            }
            else {
                return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
            }
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
        }
    }
    @PutMapping
    public ResponseEntity<?> EditEvent(@RequestBody EditEvent editEvent){
        Integer code = eventService.UpdateEvent(editEvent);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Updated"));
        }
        else if (code == 409){
            return ResponseEntity.status(code).body(new TextResp("Start must be before end"));
        }
        else if (code == 404){
            return ResponseEntity.status(code).body(new TextResp("Event not found"));
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Wrong query"));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> DeleteEvent(@PathVariable(name = "id") int id){
        Integer code = eventService.DeleteEvent(id, true);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Deleted"));
        }
        else {
            return ResponseEntity.status(code).body(new TextResp("Event not found"));
        }
    }
    @DeleteMapping("/restore/{id}")
    public ResponseEntity<?> RestoreEvent(@PathVariable(name = "id") int id){
        Integer code = eventService.DeleteEvent(id, false);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Restored"));
        }
        else {
            return ResponseEntity.status(code).body(new TextResp("Event not found"));
        }
    }
}
