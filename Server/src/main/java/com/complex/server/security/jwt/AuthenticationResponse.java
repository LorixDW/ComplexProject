package com.complex.server.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class AuthenticationResponse {
    private String jwtToken;
}
