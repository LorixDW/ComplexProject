package com.complex.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Boolean deleted;

    @JoinColumn(nullable = false)
    @ManyToOne
    private User user;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Event event;

    @OneToMany(mappedBy = "participant")
    private List<Notification> notifications;

    public Participant(String type, Boolean deleted, User user, Event event) {
        this.type = type;
        this.deleted = deleted;
        this.user = user;
        this.event = event;
        this.notifications = new ArrayList<>();
    }
}
