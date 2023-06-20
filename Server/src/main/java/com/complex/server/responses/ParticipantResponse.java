package com.complex.server.responses;

import jakarta.persistence.criteria.CriteriaBuilder;

public record ParticipantResponse(
        Long id,
        String type,
        Integer eventId,
        String lName,
        String fName,
        String patronymic,
        String email,
        String phone
) {}
