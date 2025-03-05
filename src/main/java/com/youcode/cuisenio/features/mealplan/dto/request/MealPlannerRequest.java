package com.youcode.cuisenio.features.mealplan.dto.request;

import com.youcode.cuisenio.features.mealplan.entity.MealType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.youcode.cuisenio.features.mealplan.entity.DayOfWeek;
import java.time.LocalDate;

public record MealPlannerRequest (
        @NotNull(message = "Planning date is required")
        LocalDate planningDate,

        @NotNull(message = "Day of week is required")
        DayOfWeek dayOfWeek,

        @NotNull(message = "Meal type is required")
        MealType mealType,

        Integer servings,
        String notes
) {}