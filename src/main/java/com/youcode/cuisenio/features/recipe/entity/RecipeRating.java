package com.youcode.cuisenio.features.recipe.entity;

import com.youcode.cuisenio.features.auth.entity.User;
import jakarta.persistence.*;

import java.util.Date;


@Entity
@Table(name = "recipeRating")
public class RecipeRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double score;

    @Column(nullable = false)
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public RecipeRating() {

    }

    public RecipeRating(Long id, Double score, Date createdAt, Recipe recipe, User user) {
        this.id = id;
        this.score = score;
        this.createdAt = createdAt;
        this.recipe = recipe;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Recipe getRecipe() {
        return recipe;
    }

    public void setRecipe(Recipe recipe) {
        this.recipe = recipe;
    }

    public RecipeRating(Long id, Date createdAt, Recipe recipe, User user, Double score) {
        this.id = id;
        this.createdAt = createdAt;
        this.recipe = recipe;
        this.user = user;
        this.score = score;
    }
}
