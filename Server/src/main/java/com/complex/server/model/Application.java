package com.complex.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private Boolean accepted;

    @Column(nullable = false)
    private Boolean deleted;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ApplicationType type;

    @JoinColumn(nullable = false)
    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Event event;

    public Application(String message, Boolean accepted, Boolean deleted, ApplicationType type, User user, Event event) {
        this.message = message;
        this.accepted = accepted;
        this.deleted = deleted;
        this.type = type;
        this.user = user;
        this.event = event;
    }
}
