package com.youcode.cuisenio.common.validation.validator;


//import com.youcode.cuisenio.common.validation.UniqueValue;
import jakarta.persistence.EntityManager;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

//
//@Component
//
//public class UniqueValueValidator implements ConstraintValidator<UniqueValue, Object> {
//
//    private final EntityManager entityManager;
//    private Class<?> entityClass;
//    private String fieldName;
//
//    public UniqueValueValidator( EntityManager entityManager, String fieldName ) {
//        this.entityManager = entityManager;
//        this.fieldName = fieldName;
//    }
//
//    @Override
//    public void initialize ( UniqueValue constraintAnnotation  ) {
//        entityClass = constraintAnnotation.entityClass();
//        fieldName = constraintAnnotation.fieldName();
//    }
//
//    @Override
//    public boolean isValid ( Object value, ConstraintValidatorContext constraintValidatorContext ) {
//        if (value == null) return true;
//
//        final String queryStr = String.format("SELECT COUNT(e) FROM %s e WHERE e.%s = :value", entityClass.getSimpleName(), fieldName);
//
//        Long count = entityManager.createQuery(queryStr, Long.class).setParameter("value", value).getSingleResult();
//
//        return count == 0;
//    }
//}