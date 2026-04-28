package com.cineai.backend.controller;

import com.cineai.backend.entity.Movie;
import com.cineai.backend.service.MinioService;
import com.cineai.backend.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;
    private final MinioService minioService;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String q) {
        return movieService.searchMovies(q);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Movie uploadMovie(
            @RequestParam String title,
            @RequestParam String genre,
            @RequestParam String description,
            @RequestParam(required = false) String posterUrl,
            @RequestParam("file") MultipartFile file
    ) throws Exception {
        return movieService.uploadMovie(title, genre, description, posterUrl, file);
    }

    @GetMapping(value = "/stream/{id}", produces = "video/mp4")
    public ResponseEntity<InputStreamResource> streamMovie(@PathVariable Long id) throws Exception {
        Movie movie = movieService.getMovieById(id);

        InputStream inputStream = minioService.getFile(movie.getMinioKey());
        InputStreamResource resource = new InputStreamResource(inputStream);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("video/mp4"))
                .body(resource);
    }

    @PostMapping("/ai-search")
    public List<Movie> aiSearch(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        return movieService.aiSearch(query);
    }
}