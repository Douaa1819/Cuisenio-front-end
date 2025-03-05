package com.youcode.cuisenio.features.recipe.service.impl;

import com.youcode.cuisenio.features.auth.entity.User;
import com.youcode.cuisenio.features.auth.repository.UserRepository;
import com.youcode.cuisenio.features.auth.service.UserService;
import com.youcode.cuisenio.features.recipe.dto.recipe.request.RecipeRequest;
import com.youcode.cuisenio.features.recipe.dto.recipe.response.RecipeResponse;
import com.youcode.cuisenio.features.recipe.entity.*;
import com.youcode.cuisenio.features.recipe.exception.CategoryNotFoundException;
import com.youcode.cuisenio.features.recipe.exception.IngredientNotFoundException;
import com.youcode.cuisenio.features.recipe.exception.RecipeNotFoundException;
import com.youcode.cuisenio.features.recipe.mapper.RecipeMapper;
import com.youcode.cuisenio.features.recipe.repository.CategoryRepository;
import com.youcode.cuisenio.features.recipe.repository.IngredientRepository;
import com.youcode.cuisenio.features.recipe.repository.RecipeRepository;
import com.youcode.cuisenio.features.recipe.service.RecipeService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;

    public RecipeServiceImpl(RecipeRepository recipeRepository,
                             IngredientRepository ingredientRepository,
                             CategoryRepository categoryRepository,
                             RecipeMapper recipeMapper,
                             UserRepository userRepository,
                             UserService userService) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
        this.userRepository = userRepository;
        this.recipeMapper = recipeMapper;
    }


    @Override
    public RecipeResponse createRecipe(String email, RecipeRequest request) {
        Recipe recipe = recipeMapper.toEntity(request);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        recipe.setUser(user);

        Recipe finalRecipe = recipe;
        List<RecipeIngredient> recipeIngredients = request.ingredients().stream()
                .map(ingredientRequest -> {
                    Ingredient ingredient = ingredientRepository.findById(ingredientRequest.ingredientId())
                            .orElseThrow(() -> new IngredientNotFoundException(
                                    "Ingredient not found with id: " + ingredientRequest.ingredientId()));

                    RecipeIngredient recipeIngredient = new RecipeIngredient();
                    recipeIngredient.setRecipe(finalRecipe);
                    recipeIngredient.setIngredient(ingredient);
                    recipeIngredient.setQuantity(ingredientRequest.quantity());
                    recipeIngredient.setUnit(ingredientRequest.unit());
                    return recipeIngredient;
                })
                .collect(Collectors.toList());

        recipe.setIngredients(recipeIngredients);

        Recipe finalRecipe1 = recipe;
        List<RecipeStep> recipeSteps = request.steps().stream()
                .map(stepRequest -> {
                    RecipeStep recipeStep = new RecipeStep();
                    recipeStep.setStepNumber(stepRequest.stepNumber());
                    recipeStep.setDescription(stepRequest.description());
                    recipeStep.setRecipe(finalRecipe1);
                    return recipeStep;
                })
                .collect(Collectors.toList());

        recipe.setSteps(recipeSteps);

        recipe = recipeRepository.save(recipe);

        return recipeMapper.toResponse(recipe);
    }

    public Page<RecipeResponse> findAll(Pageable pageable) {
        return recipeRepository.findAll(pageable).map(recipeMapper::toResponse);
    }

    public RecipeResponse findById(Long id) {
        return recipeRepository.findById(id).map(recipeMapper::toResponse)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe non trouvé avec l'id: " + id));
    }

    public RecipeResponse create(RecipeRequest recipeRequest) {
        Recipe recipe = recipeMapper.toEntity(recipeRequest);
        recipe = recipeRepository.save(recipe);
        return recipeMapper.toResponse(recipe);
    }

    public RecipeResponse update(Long id, RecipeRequest recipeRequest) {
        Recipe recipe = recipeRepository.findById(id).orElseThrow(()-> new RecipeNotFoundException("Recipe Not Found with id : "+id));
        return recipeMapper.toResponse(recipeRepository.save(recipe));
    }

    public void delete(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RecipeNotFoundException("Recipe Not Found with id : "+id);
        }
        recipeRepository.deleteById(id);
    }
}
