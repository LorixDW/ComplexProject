package com.complex.server.requests;

public record UpdateUserFIO(
        String lName,
        String fName,
        String patronymic
) {}
