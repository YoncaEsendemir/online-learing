package com.eogrenme.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eogrenme.entits.Course;


@Repository
public interface IRepositoryCourse extends JpaRepository<Course,Long> {
     Optional<Course> findByTitle(String title);
 @Query("SELECT DISTINCT c FROM Course c JOIN c.categories cat WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :courseName, '%')) AND LOWER(cat.name) LIKE LOWER(CONCAT('%', :category, '%'))")
     List<Course> searchCourses(@Param("courseName") String courseName, @Param("category") String category);
     
}
