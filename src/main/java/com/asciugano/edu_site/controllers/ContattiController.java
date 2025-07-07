package com.asciugano.edu_site.controllers;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.asciugano.edu_site.models.Contatto;
import com.asciugano.edu_site.repositories.ContattiRepository;

@Controller
public class ContattiController {

  private final ContattiRepository contattiRepository;

  public ContattiController(ContattiRepository contattiRepository) {
    this.contattiRepository = contattiRepository;
  }

  @GetMapping("/contatti")
  public String getContatti(Model model) {
    List<Contatto> contatti = contattiRepository.findAll();

    model.addAttribute("contatti", contatti);

    return "contatti";
  }
}
