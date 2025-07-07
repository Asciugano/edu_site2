package com.asciugano.edu_site.models;

import jakarta.persistence.*;

@Entity
@Table(name = "contatti")
public class Contatto {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String name;

  private String role;

  private String extra;

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getName() {
    return name;
  }

  public String getRole() {
    return role;
  }

  public String getExtra() {
    return extra;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public void setExtra(String extra) {
    this.extra = extra;
  }
}
