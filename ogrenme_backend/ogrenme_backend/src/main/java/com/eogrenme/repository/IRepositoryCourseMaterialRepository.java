package com.eogrenme.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eogrenme.entits.Course;
import com.eogrenme.entits.CourseMaterial;

@Repository
public interface IRepositoryCourseMaterialRepository extends JpaRepository<CourseMaterial,Long> {
 Optional <CourseMaterial> findByTitleAndCourse(String title, Course course);
}
