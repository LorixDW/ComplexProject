package com.complex.server.responses;

import com.complex.server.model.ApplicationType;

public record ApplicationResponse(
        Integer id,
        Integer eventId,
        String title,
        UserResp user,
        String message,
        ApplicationType type
) { }
