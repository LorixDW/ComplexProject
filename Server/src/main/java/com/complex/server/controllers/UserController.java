package com.complex.server.controllers;

import com.complex.server.model.*;
import com.complex.server.requests.UpdateUserFIO;
import com.complex.server.requests.admin.AdminUpdateUserData;
import com.complex.server.responses.TextResp;
import com.complex.server.responses.UserResp;
import com.complex.server.services.UserService;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> GetCurrentUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        token = token.substring(7);
        User user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user != null){
            return ResponseEntity.ok(new UserResp(
                    user.getLName(),
                    user.getFName(),
                    user.getPatronymic(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getRole().getName()
            ));
        }
        else {
            System.out.println(token);
            return ResponseEntity.status(400).body(new TextResp("Something went wrong"));

        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> GetAllUsers(){
        List<User> users = userService.GetAllUsers();
        return ResponseEntity.ok(users.stream().map(user -> new UserResp(
                user.getLName(),
                user.getFName(),
                user.getPatronymic(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName()
        )).toList());
    }

    @PutMapping("/update/fio")
    public ResponseEntity<?> UpdateUserFIO(@RequestBody UpdateUserFIO data, @RequestHeader(HttpHeaders.AUTHORIZATION) String token){
        token = token.substring(7);
        User user = userService.GetByEmail(jwtUtil.extractUsername(token));
        if(user != null){
            user.setLName(data.lName());
            user.setFName(data.fName());
            user.setPatronymic(data.patronymic());
            int code = userService.SaveUser(user);
            if(code == 200){
                return ResponseEntity.ok(new TextResp("Updated"));
            }
            else if (code == 404){
                return ResponseEntity.notFound().build();
            }
            else if (code == 409){
                return ResponseEntity.status(409).body(new TextResp("Email already exists"));
            }
            else {
                return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
            }
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
        }
    }
    @PutMapping("/update/all")
    public ResponseEntity<?> AdminUserUpdate(@RequestBody AdminUpdateUserData data){
        User user = userService.GetByEmail(data.oldEmail());
        if(user != null){
            user.setLName(data.lName());
            user.setFName(data.fName());
            user.setPatronymic(data.patronymic());
            user.setPhone(data.phone());
            user.setEmail(data.email());
            int code = userService.SaveUser(user);
            if(code == 200){
                return ResponseEntity.ok(new TextResp("Updated"));
            }
            else if (code == 404){
                return ResponseEntity.notFound().build();
            }
            else if (code == 409){
                return ResponseEntity.status(409).body(new TextResp("Email already exists"));
            }
            else {
                return ResponseEntity.badRequest().body(new TextResp("Something went wrong"));
            }
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
}
