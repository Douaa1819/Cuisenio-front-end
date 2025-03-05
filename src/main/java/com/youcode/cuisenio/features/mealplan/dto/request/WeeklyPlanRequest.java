package com.youcode.cuisenio.features.mealplan.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record WeeklyPlanRequest (
    @NotNull(message = "Start date is required")
     LocalDate startDate
){}