package com.eogrenme.repository;

import com.eogrenme.entits.Course;

import com.eogrenme.entits.Video;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IRepositoryCourseVideo extends JpaRepository<Video,Long> {
    Optional<Video> findByUrlAndCourse(String url, Course course);
}
