package com.complex.server.controllers;

import com.complex.server.model.*;
import com.complex.server.requests.AddApplicationData;
import com.complex.server.responses.ApplicationResponse;
import com.complex.server.responses.TextResp;
import com.complex.server.responses.UserResp;
import com.complex.server.services.ApplicationService;
import com.complex.server.services.EventService;
import com.complex.server.services.UserService;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/application")
public class ApplicationController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private EventService eventService;
    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/all")
    public ResponseEntity<?> GetAllApplications(
            @RequestParam(required = false) Integer eventId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestParam(required = false) Boolean accepted,
            @RequestParam(required = false) Boolean deleted,
            @RequestParam(required = false) String email,
            @RequestParam(required = true) Boolean self,
            @RequestParam(required = true) ApplicationType type
    ){
        if(type == null){
            return ResponseEntity.badRequest().body(new TextResp("Write needed type"));
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
        if(deleted == null){
            deleted = false;
        }
        if(eventId == null){
            eventId = 0;
        }
        Event event = eventService.GetEventById(eventId);
        List<Application> applications = applicationService.GetAll(user, type, event, accepted, deleted);
        return ResponseEntity.ok(applications.stream().map(a -> new ApplicationResponse(
                a.getId(),
                a.getEvent().getId(),
                a.getEvent().getTitle(),
                new UserResp(
                        a.getUser().getLName(),
                        a.getUser().getFName(),
                        a.getUser().getPatronymic(),
                        a.getUser().getEmail(),
                        a.getUser().getPhone(),
                        a.getUser().getRole().getName()
                ),
                a.getMessage(),
                a.getType()
        )).toList());
    }
    @PostMapping()
    public ResponseEntity<?> AddApplication(
            @RequestBody AddApplicationData data,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token
            ){
        User user;
        if(data.type() == ApplicationType.APPLICATION){
            token = token.substring(7);
            user = userService.GetByEmail(jwtUtil.extractUsername(token));
        }else if (data.type() == ApplicationType.INVITE){
            if(data.email() == null){
                return ResponseEntity.badRequest().body(new TextResp("Write needed email"));
            }
            user = userService.GetByEmail(data.email());
        }else {
            return ResponseEntity.badRequest().body(new TextResp("Write needed type"));
        }
        if(data.eventId() == null){
            return ResponseEntity.badRequest().body(new TextResp("Write needed event"));
        }
        Event event = eventService.GetEventById(data.eventId());
        if(event == null){
            return ResponseEntity.status(404).body(new TextResp("There are no such event"));
        }
        if(event.getPrivacy() != Privacy.HALF_OPEN){
            return ResponseEntity.status(405).body(new TextResp("Event must be half-open"));
        }
        if(user == null){
            return ResponseEntity.status(404).body(new TextResp("There are no such user"));
        }
        Integer code = applicationService.Add(user, event, data.type(), data.message());
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Created"));
        }else if (code == 409){
            return ResponseEntity.status(code).body(new TextResp("Such application already exists"));
        }else {
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> AcceptApplication(@PathVariable(name = "id") Integer id, @RequestParam String participantType){
        Integer code = applicationService.Accept(id, participantType);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Accepted"));
        }else if(code == 404){
            return ResponseEntity.status(code).body(new TextResp("There are no such application"));
        }else {
            return ResponseEntity.badRequest().body(new TextResp("invalid query"));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> DeleteApplication(@PathVariable(name = "id") Integer id){
        Integer code = applicationService.Delete(id, true);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Deleted"));
        }else {
            return ResponseEntity.status(404).body(new TextResp("There are no such application"));
        }
    }
    @DeleteMapping("/restore/{id}")
    public ResponseEntity<?> RestoreApplication(@PathVariable(name = "id") Integer id){
        Integer code = applicationService.Delete(id, false);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Restored"));
        }else {
            return ResponseEntity.status(404).body(new TextResp("There are no such application"));
        }
    }
}
