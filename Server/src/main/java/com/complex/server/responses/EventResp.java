package com.complex.server.responses;

import com.complex.server.model.Privacy;
import com.complex.server.requests.DateTime;

public record EventResp(
        Integer  id,
        String title,
        String summary,
        String description,
        String place,
        DateTime start,
        DateTime end,
        Privacy privacy,
        UserResp creator,
        Boolean isSelf //принадлежит ли тому кто запрашивал
) {}
