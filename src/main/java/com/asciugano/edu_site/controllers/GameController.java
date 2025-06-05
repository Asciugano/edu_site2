package com.asciugano.edu_site.controllers;

import com.asciugano.edu_site.repositories.GameRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @GetMapping("/")
    public String index() {
        return "/info";
    }

    @GetMapping("/info")
    public String info() {
        return "/info";
    }
}
