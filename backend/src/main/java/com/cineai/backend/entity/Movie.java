package com.cineai.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String genre;

    @Column(length = 2000)
    private String description;

    private String posterUrl;

    private String minioKey;

    private String summary;

    private LocalDateTime uploadedAt;
}