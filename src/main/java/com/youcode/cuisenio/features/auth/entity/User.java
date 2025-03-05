package com.youcode.cuisenio.features.auth.entity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.youcode.cuisenio.features.mealplan.entity.MealPlanner;
import com.youcode.cuisenio.features.recipe.entity.Recipe;
import com.youcode.cuisenio.features.recipe.entity.RecipeComment;
import com.youcode.cuisenio.features.recipe.entity.RecipeRating;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users")
@Data

@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    LocalDateTime registrationDate;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Recipe> recipes = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<RecipeRating> ratings = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<RecipeComment> comments = new ArrayList<>();

    @Column(nullable = false)

    private Boolean blocked = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<MealPlanner> mealPlans = new ArrayList<>();

    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }
    @PrePersist
    public void prePersist() {
        this.registrationDate = LocalDateTime.now();
    }


}
