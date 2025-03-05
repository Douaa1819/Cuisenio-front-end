package com.youcode.cuisenio.features.recipe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.youcode.cuisenio.features.auth.entity.User;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficultyLevel;

    @Column(nullable = false)
    private Integer preparationTime;

    @Column(nullable = false)
    private Integer cookingTime;

    @Column(nullable = false)
    private Integer servings;

    private String imageUrl;

    @Column(nullable = false)
    private Date creationDate;

    @Column(nullable = false)
    private Boolean isApproved = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference("recipes")
    private User user;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> ingredients;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeStep> steps;


  @ManyToOne
  @JoinColumn(name = "categorie_id", nullable = false)
  private Category categorie;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeRating> ratings;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeComment> comments;



    public Recipe() {

    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    @PrePersist
    protected void onCreate() {
        this.creationDate = new Date();
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public List<RecipeComment> getComments() {
        return comments;
    }

    public void setComments(List<RecipeComment> comments) {
        this.comments = comments;
    }

    public List<RecipeRating> getRatings() {
        return ratings;
    }

    public Category getCategorie() {
        return categorie;
    }

    public void setCategorie(Category categorie) {
        this.categorie = categorie;
    }

    public void setRatings(List<RecipeRating> ratings) {
        this.ratings = ratings;
    }

    public Category getCategories() {
        return categorie;
    }

    public void setCategories(Category categorie) {
        this.categorie = categorie;
    }

    public List<RecipeStep> getSteps() {
        return steps;
    }

    public void setSteps(List<RecipeStep> steps) {
        this.steps = steps;
    }

    public List<RecipeIngredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<RecipeIngredient> ingredients) {
        this.ingredients = ingredients;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getApproved() {
        return isApproved;
    }

    public void setApproved(Boolean approved) {
        isApproved = approved;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getServings() {
        return servings;
    }

    public void setServings(Integer servings) {
        this.servings = servings;
    }

    public Integer getCookingTime() {
        return cookingTime;
    }

    public void setCookingTime(Integer cookingTime) {
        this.cookingTime = cookingTime;
    }

    public Integer getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(Integer preparationTime) {
        this.preparationTime = preparationTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Recipe(List<RecipeStep> steps,Category category, List<RecipeRating> ratings, List<RecipeComment> comments, List<RecipeIngredient> ingredients, User user, Boolean isApproved, Date creationDate, String imageUrl, Integer servings, Integer cookingTime, DifficultyLevel difficultyLevel, Integer preparationTime, String description, String title, Long id) {
        this.steps = steps;
        this.ratings = ratings;
        this.comments = comments;
        this.ingredients = ingredients;
        this.categorie=category;
        this.user = user;
        this.isApproved = isApproved;
        this.creationDate = creationDate;
        this.imageUrl = imageUrl;
        this.servings = servings;
        this.cookingTime = cookingTime;
        this.difficultyLevel = difficultyLevel;
        this.preparationTime = preparationTime;
        this.description = description;
        this.title = title;
        this.id = id;
    }
}