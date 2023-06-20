package com.complex.server.requests;

import com.complex.server.model.Privacy;
import com.complex.server.model.User;

import java.time.LocalDateTime;

public record EventAddForm(
        String title,
        String summary,
        String description,
        String place,
        DateTime start,
        DateTime end,
        Privacy privacy
) {}
