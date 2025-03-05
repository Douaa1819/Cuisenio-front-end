package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.entity.Recipe;
import com.youcode.cuisenio.features.recipe.exception.RecipeNotFoundException;
import com.youcode.cuisenio.features.recipe.repository.RecipeRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Transactional
public class RecipeImageService {

    private final RecipeRepository recipeRepository;
    private final String uploadDirectory = "uploads/recipes/";

    public RecipeImageService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
        try {
            Files.createDirectories(Paths.get(uploadDirectory));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String uploadRecipeImage(Long recipeId, MultipartFile file) throws IOException {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + recipeId));

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;


        Path filePath = Paths.get(uploadDirectory + filename);
        Files.write(filePath, file.getBytes());


        recipe.setImageUrl("/api/recipes/images/" + filename);
        recipeRepository.save(recipe);

        return recipe.getImageUrl();
    }

    public byte[] getRecipeImage(String filename) throws IOException {
        Path imagePath = Paths.get(uploadDirectory + filename);
        if (!Files.exists(imagePath)) {
            throw new IOException("Image not found: " + filename);
        }
        return Files.readAllBytes(imagePath);
    }

    public void deleteRecipeImage(Long recipeId) throws IOException {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + recipeId));

        if (recipe.getImageUrl() != null && !recipe.getImageUrl().isEmpty()) {
            String filename = recipe.getImageUrl().substring(recipe.getImageUrl().lastIndexOf("/") + 1);
            Path imagePath = Paths.get(uploadDirectory + filename);

            if (Files.exists(imagePath)) {
                Files.delete(imagePath);
            }

            recipe.setImageUrl(null);
            recipeRepository.save(recipe);
        }
    }
}