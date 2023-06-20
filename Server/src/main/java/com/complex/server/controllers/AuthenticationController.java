package com.complex.server.controllers;

import com.complex.server.model.User;
import com.complex.server.requests.RegisterForm;
import com.complex.server.responses.TextResp;
import com.complex.server.security.jwt.AuthenticationDTO;
import com.complex.server.security.jwt.AuthenticationResponse;
import com.complex.server.security.jwt.SecondFactorData;
import com.complex.server.security.services.UserDetailsServiceImpl;
import com.complex.server.services.UserService;
import com.complex.server.utils.EmailUtil;
import com.complex.server.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailUtil emailUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationDTO authenticationDTO){
        UserDetails user = userService.GetUserByEmailAndPassword(authenticationDTO.getEmail(), authenticationDTO.getPassword());
        if(user != null){
            return ResponseEntity.ok(new AuthenticationResponse(jwtUtil.generateToken(user.getUsername())));
        }
        else {
            return ResponseEntity.badRequest().body("Incorrect email or password");
        }
    }
    @PostMapping("/login/first")
    public ResponseEntity<?> loginFirst(@RequestBody AuthenticationDTO authenticationDTO){
        User user = userService.GetUserByEmailAndPassword(authenticationDTO.getEmail(), authenticationDTO.getPassword());
        if(user != null){
            String checkCode = emailUtil.CheckCodeGenerate();
            user.setEmailCheckCode(checkCode);
            userService.SaveUser(user);
            emailUtil.SendMessage(user.getEmail(), "Your authentication code", checkCode);
            return ResponseEntity.ok(new TextResp("CodeSent"));
        }
        else {
            return ResponseEntity.status(409).body(new TextResp("Incorrect email or password"));
        }
    }
    @PostMapping("/login/second")
    public ResponseEntity<?> loginSecond(@RequestBody SecondFactorData data){
        if(data.code() == null || data.email() == null){
            return ResponseEntity.badRequest().body( new TextResp("Invalid query"));
        }
        User user = userService.GetByEmail(data.email());
        if(user != null){
            if (Objects.equals(user.getEmailCheckCode(), data.code())){
                return ResponseEntity.ok(new AuthenticationResponse(jwtUtil.generateToken(user.getUsername())));
            }else {
                return ResponseEntity.status(409).body(new TextResp("Incorrect checking code"));
            }
        }else {
            return ResponseEntity.status(404).body(new TextResp("User not found"));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterForm registerForm){
        Integer status = userService.AddUser( new User(registerForm.lName(),
                registerForm.fName(),
                registerForm.patronymic(),
                registerForm.phone(),
                registerForm.email(),
                registerForm.password(),
                userService.GetRoleByID(registerForm.roleId())));
        if(status == 200){
            return ResponseEntity.ok(new TextResp("Created"));
        }
        else if (status == 409){
            return ResponseEntity.status(409).body(new TextResp("Email already exists"));
        }
        else {
            return ResponseEntity.badRequest().body(new TextResp("Bad data"));
        }
    }
}
