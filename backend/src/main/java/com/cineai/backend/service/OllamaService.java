package com.cineai.backend.service;

import com.cineai.backend.entity.Movie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OllamaService {

    @Value("${ollama.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;

    public String askOllama(String prompt) {
        WebClient webClient = WebClient.builder()
                .baseUrl(ollamaUrl)
                .build();

        Map<String, Object> request = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false
        );

        Map response = webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return response.get("response").toString();
    }

    public String generateSummary(Movie movie) {
        String prompt = """
                Write a short 2 sentence summary for this movie.

                Title: %s
                Genre: %s
                Description: %s
                """.formatted(
                movie.getTitle(),
                movie.getGenre(),
                movie.getDescription()
        );

        return askOllama(prompt);
    }

    public String aiSearch(String query, List<Movie> movies) {
        String movieList = movies.stream()
                .map(m -> "- " + m.getTitle() + " (" + m.getGenre() + "): " + m.getDescription())
                .toList()
                .toString();

        String prompt = """
                User wants to find a movie.

                User query: %s

                Available movies:
                %s

                Return only matching movie titles.
                """.formatted(query, movieList);

        return askOllama(prompt);
    }
}