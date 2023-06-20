package com.complex.server.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "natification_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private Boolean deleted;

    @JoinColumn(nullable = false)
    @ManyToOne
    private Participant participant;

    public Notification(String description, LocalDate date, Boolean deleted, Participant participant) {
        this.description = description;
        this.deleted = deleted;
        this.participant = participant;
        this.date = date;
    }
}
