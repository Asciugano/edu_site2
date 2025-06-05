package com.asciugano.edu_site.controllers;

import com.asciugano.edu_site.models.Game;
import com.asciugano.edu_site.repositories.GameRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class GameController {

    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @GetMapping("/")
    public String index() {
        return "info";
    }

    @GetMapping("/info")
    public String info() {
        return "info";
    }

    @GetMapping("/games")
    public String play(Model model) {
        List<Game> games = gameRepository.findAll();

        model.addAttribute("games", games);
        return "games";
    }

    @GetMapping("/play/{id}")
    public String play(@PathVariable Long id, Model model) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));

        model.addAttribute("game", game);

        return game.getPath();
    }

    @GetMapping("/game/{id}")
    public String gameById(@PathVariable Long id, Model model) {
        Game game = gameRepository.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        model.addAttribute("game", game);

        return "game";
    }

    @GetMapping("/game")
    public String gameByName(Model model, @RequestParam String name) {
        Game game = gameRepository.findByTitle(name).orElseThrow(() -> new RuntimeException("Game not found"));

        model.addAttribute("game", game);
        return game.getPath();
    }
}
