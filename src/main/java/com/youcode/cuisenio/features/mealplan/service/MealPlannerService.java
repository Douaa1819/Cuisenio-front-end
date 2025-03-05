package com.youcode.cuisenio.features.mealplan.service;

import com.youcode.cuisenio.features.auth.entity.User;
import com.youcode.cuisenio.features.mealplan.dto.request.MealPlannerRequest;
import com.youcode.cuisenio.features.mealplan.dto.response.MealPlannerResponse;
import com.youcode.cuisenio.features.mealplan.entity.MealPlanner;
import com.youcode.cuisenio.features.mealplan.exception.MealPlannerNotFoundException;
import com.youcode.cuisenio.features.mealplan.mapper.MealPlannerMapper;
import com.youcode.cuisenio.features.mealplan.repository.MealPlannerRepository;
import com.youcode.cuisenio.features.recipe.entity.Recipe;
import com.youcode.cuisenio.features.recipe.exception.RecipeNotFoundException;
import com.youcode.cuisenio.features.recipe.repository.RecipeRepository;
import com.youcode.cuisenio.features.auth.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MealPlannerService {

    private final MealPlannerRepository mealPlannerRepository;
    private final RecipeRepository recipeRepository;
    private final UserService userService;
    private final MealPlannerMapper mealPlannerMapper;

    public MealPlannerService(MealPlannerRepository mealPlannerRepository,
                              RecipeRepository recipeRepository,
                              UserService userService,
                              MealPlannerMapper mealPlannerMapper) {
        this.mealPlannerRepository = mealPlannerRepository;
        this.recipeRepository = recipeRepository;
        this.userService = userService;
        this.mealPlannerMapper = mealPlannerMapper;
    }

    public MealPlannerResponse createMealPlan(Long recipeId, MealPlannerRequest request, String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + recipeId));

        MealPlanner mealPlanner = mealPlannerMapper.toEntity(request);
        mealPlanner.setUser(user);
        mealPlanner.setRecipe(recipe);

        if (mealPlanner.getDayOfWeek() == null || mealPlanner.getMealType() == null) {
            throw new IllegalArgumentException("Day of week and meal type are required");
        }

        mealPlanner = mealPlannerRepository.save(mealPlanner);

        return mealPlannerMapper.toResponse(mealPlanner);
    }


    public List<MealPlannerResponse> getMealPlansByUser(String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MealPlanner> mealPlanners = mealPlannerRepository.findByUser(user);

        return mealPlanners.stream()
                .map(mealPlannerMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MealPlannerResponse updateMealPlan(Long id, MealPlannerRequest request) {
        MealPlanner mealPlanner = mealPlannerRepository.findById(id)
                .orElseThrow(() -> new MealPlannerNotFoundException("Meal plan not found with id: " + id));

        mealPlanner.setPlanningDate(request.planningDate());
        mealPlanner.setDayOfWeek(request.dayOfWeek());
        mealPlanner.setMealType(request.mealType());
        mealPlanner.setServings(request.servings());
        mealPlanner.setNotes(request.notes());

        mealPlanner = mealPlannerRepository.save(mealPlanner);

        return mealPlannerMapper.toResponse(mealPlanner);
    }

    public void deleteMealPlan(Long id) {
        if (!mealPlannerRepository.existsById(id)) {
            throw new MealPlannerNotFoundException("Meal plan not found with id: " + id);
        }
        mealPlannerRepository.deleteById(id);
    }
}