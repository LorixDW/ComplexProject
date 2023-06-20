package com.complex.server.controllers;

import com.complex.server.model.Event;
import com.complex.server.model.Participant;
import com.complex.server.model.Privacy;
import com.complex.server.model.User;
import com.complex.server.requests.AddParticipantData;
import com.complex.server.requests.EditParticipantData;
import com.complex.server.responses.ParticipantResponse;
import com.complex.server.responses.TextResp;
import com.complex.server.services.EventService;
import com.complex.server.services.ParticipantsService;
import com.complex.server.services.UserService;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participant")
public class ParticipantController {
    @Autowired
    private ParticipantsService participantsService;
    @Autowired
    private EventService eventService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/event/{id}")
    public ResponseEntity<?> GetAllParticipants(@PathVariable(name = "id") int id){
        List<Participant> list = participantsService.GetAll(id);
        return ResponseEntity.ok(
                list.stream().map(p -> new ParticipantResponse(
                        p.getId(),
                        p.getType(),
                        p.getEvent().getId(),
                        p.getUser().getLName(),
                        p.getUser().getFName(),
                        p.getUser().getPatronymic(),
                        p.getUser().getEmail(),
                        p.getUser().getPhone()
                ))
        );
    }
    @GetMapping("/event/deleted/{id}")
    public ResponseEntity<?> GetAllDeletedParticipants(@PathVariable(name = "id") int id){
        List<Participant> list = participantsService.GetAllDeleted(id);
        return ResponseEntity.ok(
                list.stream().map(p -> new ParticipantResponse(
                        p.getId(),
                        p.getType(),
                        p.getEvent().getId(),
                        p.getUser().getLName(),
                        p.getUser().getFName(),
                        p.getUser().getPatronymic(),
                        p.getUser().getEmail(),
                        p.getUser().getPhone()
                ))
        );
    }
    @PostMapping()
    public ResponseEntity<?> AddParticipant(@RequestBody AddParticipantData data, @RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        token = token.substring(7);
        User user = userService.GetByEmail(jwtUtil.extractUsername(token));
        Event event = eventService.GetEventById(data.eventId());
        if(user != null && event != null){
            if(event.getPrivacy() != Privacy.OPEN){
                return ResponseEntity.status(405).body(new TextResp("Event privacy must be open"));
            }
            Integer code = participantsService.Add(event, user, data.type());
            if(code == 200){
                return ResponseEntity.ok(new TextResp("Created"));
            }
            else if (code == 409){
                return ResponseEntity.status(409).body(new TextResp("This participant already exists"));
            }
            else {
                return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
            }
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("There are no such event or user"));
        }
    }

    @PutMapping()
    public ResponseEntity<?> EditParticipant(@RequestBody EditParticipantData data){
        Integer code = participantsService.Update(data);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Updated"));
        }
        else if(code == 404){
            return ResponseEntity.status(code).body(new TextResp("There are no such participant"));
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> DeleteParticipant(@PathVariable(name = "id") Long id){
        Integer code = participantsService.Delete(id, true);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Deleted"));
        }
        else if(code == 404){
            return ResponseEntity.status(code).body(new TextResp("There are no such participant"));
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
    }
    @DeleteMapping("/restore/{id}")
    public ResponseEntity<?> RestoreParticipant(@PathVariable(name = "id") Long id){
        Integer code = participantsService.Delete(id, false);
        if(code == 200){
            return ResponseEntity.ok(new TextResp("Restored"));
        }
        else if(code == 404){
            return ResponseEntity.status(code).body(new TextResp("There are no such participant"));
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Invalid query"));
        }
    }
}
