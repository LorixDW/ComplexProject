package com.complex.server.responses;

import com.complex.server.requests.Date;
import com.complex.server.requests.DateTime;

public record NotificationResponse(
        Long id,
        Integer eventId,
        String title,
        String description,
        Date sent,
        DateTime start,
        DateTime end,
        UserResp user
) {}
