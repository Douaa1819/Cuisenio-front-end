package com.youcode.cuisenio.common.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CrudService<Id, REQUEST_DTO, RESPONSE_DTO> {

    Page<RESPONSE_DTO> findAll (Pageable pageable);
    RESPONSE_DTO findById(Id id);
    RESPONSE_DTO create(REQUEST_DTO dto);
    RESPONSE_DTO update(Id id, REQUEST_DTO dto);
    void delete(Id id);
}