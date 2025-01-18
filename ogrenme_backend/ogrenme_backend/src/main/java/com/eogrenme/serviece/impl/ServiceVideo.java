package com.eogrenme.serviece.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Collections;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import com.eogrenme.dto.DtoVideoUI;
import com.eogrenme.entits.Course;
import com.eogrenme.entits.Video;
import com.eogrenme.repository.IRepositoryCourse;
import com.eogrenme.repository.IRepositoryCourseVideo;
import com.eogrenme.serviece.IServiceVideo;

@Service
public class ServiceVideo implements IServiceVideo{

    @Autowired IRepositoryCourseVideo videoRepository;
     @Autowired IRepositoryCourse courseRepository;

    @Override
    public Boolean deteletVideo(Long id) {
       if(id==null){
        return false;
       }
        Optional <Video> op= videoRepository.findById(id);
        if(op.isEmpty()){
        return false;
        }
        videoRepository.delete(op.get());
        return true;
    }

    @Override
    public List<DtoVideoUI> getVideoByCourseId(Long courseId) {
        if (courseId == null) {
            return Collections.emptyList();
        }
        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isEmpty()) {
            return Collections.emptyList();
        }
        Course course = courseOptional.get();
        return course.getVideos().stream()
                .map(this::ConvertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DtoVideoUI addVideo(Long courseId, DtoVideoUI videoDto,String videoUrl) {
        if (courseId == null || videoDto == null) {
            throw new IllegalArgumentException("Course ID and video details are required");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        Video video = new Video();
        video.setTitle(videoDto.getTitle());
        video.setUrl(videoUrl);
        video.setDuration(videoDto.getDuration());
        video.setCourse(course);

        Video savedVideo = videoRepository.save(video);
        return ConvertToDto(savedVideo);
    }

    private DtoVideoUI ConvertToDto(Video video){
        DtoVideoUI dto = new DtoVideoUI();
        dto.setId(video.getId());
        dto.setTitle(video.getTitle());
        dto.setUrl(video.getUrl());
        return dto;
    }

    
}
