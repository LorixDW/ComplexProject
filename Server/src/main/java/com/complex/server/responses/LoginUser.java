package com.complex.server.responses;

public record LoginUser(
        String lName,
        String fName,
        String patronymic,
        String phone,
        String email,
        Integer roleId
) {
}
