package com.youcode.cuisenio.features.mealplan.exception;

import com.youcode.cuisenio.common.exception.base.BusinessException;

public class MealPlannerNotFoundException extends BusinessException {
    public MealPlannerNotFoundException(String message) {
        super(message, "MEAL_PLANNER_NOT_FOUND");
    }
}
