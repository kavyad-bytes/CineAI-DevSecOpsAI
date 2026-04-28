package com.cineai.backend.service;

import com.cineai.backend.entity.Movie;
import com.cineai.backend.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final MinioService minioService;
    private final OllamaService ollamaService;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> searchMovies(String query) {
        return movieRepository.findByTitleContainingIgnoreCaseOrGenreContainingIgnoreCase(
                query,
                query
        );
    }

    public Movie uploadMovie(
            String title,
            String genre,
            String description,
            String posterUrl,
            MultipartFile file
    ) throws Exception {

        String minioKey = minioService.uploadFile(file);

        Movie movie = Movie.builder()
                .title(title)
                .genre(genre)
                .description(description)
                .posterUrl(posterUrl)
                .minioKey(minioKey)
                .uploadedAt(LocalDateTime.now())
                .build();

        Movie savedMovie = movieRepository.save(movie);

        String summary = ollamaService.generateSummary(savedMovie);
        savedMovie.setSummary(summary);

        return movieRepository.save(savedMovie);
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<Movie> aiSearch(String query) {
        List<Movie> movies = movieRepository.findAll();

        String aiResult = ollamaService.aiSearch(query, movies);

        return movies.stream()
                .filter(movie -> aiResult.toLowerCase().contains(movie.getTitle().toLowerCase()))
                .toList();
    }
}