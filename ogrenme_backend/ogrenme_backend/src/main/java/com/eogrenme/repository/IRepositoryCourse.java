package com.eogrenme.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eogrenme.entits.Course;


@Repository
public interface IRepositoryCourse extends JpaRepository<Course,Long> {
     Optional<Course> findByTitle(String title);
}
