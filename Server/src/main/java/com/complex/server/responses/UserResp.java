package com.complex.server.responses;

public record UserResp(
        String lName,
        String fName,
        String patronymic,
        String email,
        String phone,
        String role
) { }
