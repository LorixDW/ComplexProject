package com.complex.server.security.jwt;
import lombok.Data;

@Data
public class AuthenticationDTO {

    private String email;

    private String password;
}
