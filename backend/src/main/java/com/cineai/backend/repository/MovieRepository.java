package com.cineai.backend.repository;

import com.cineai.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    List<Movie> findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(
            String title,
            String genre
    );
}