package com.asciugano.edu_site.repositories;

import com.asciugano.edu_site.models.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GameRepository extends JpaRepository<Game, Long> {
    Optional<Game> findByTitle(String name);
}
