package com.asciugano.edu_site.repositories;

import com.asciugano.edu_site.models.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
}
