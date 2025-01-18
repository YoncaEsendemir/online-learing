package com.eogrenme.repository;

import com.eogrenme.entits.Category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRepositoryCategory extends JpaRepository<Category,Long> {
    Optional <Category> findById(Long id);
    Optional<Category> findByName(String name);
}
