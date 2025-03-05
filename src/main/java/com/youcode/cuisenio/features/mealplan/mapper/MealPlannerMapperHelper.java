package com.youcode.cuisenio.features.mealplan.mapper;

import com.youcode.cuisenio.features.mealplan.entity.MealType;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;
import com.youcode.cuisenio.features.mealplan.entity.DayOfWeek;
@Component
public class MealPlannerMapperHelper {

    @Named("mapDayOfWeek")
    public DayOfWeek mapDayOfWeek(String day) {
        return day != null ? DayOfWeek.valueOf(day.toUpperCase()) : null;
    }

    @Named("mapDayOfWeekReverse")
    public String mapDayOfWeekReverse(DayOfWeek dayOfWeek) {
        return dayOfWeek != null ? dayOfWeek.name() : null;
    }

    @Named("mapMealType")
    public MealType mapMealType(String mealType) {
        return mealType != null ? MealType.valueOf(mealType.toUpperCase()) : null;
    }

    @Named("mapMealTypeReverse")
    public String mapMealTypeReverse(MealType mealType) {
        return mealType != null ? mealType.name() : null;
    }
}
