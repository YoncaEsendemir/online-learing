package com.eogrenme.serviece.impl;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eogrenme.entits.Category;
import com.eogrenme.entits.Course;
import com.eogrenme.entits.CourseMaterial;
import com.eogrenme.entits.Video;
import com.eogrenme.dto.CourseSearchCriteria;
import com.eogrenme.dto.DtoCategoryUI;
import com.eogrenme.dto.DtoCourseMaterialUI;
import com.eogrenme.dto.DtoCourseUI;
import com.eogrenme.dto.DtoVideoUI;
import com.eogrenme.repository.IRepositoryCategory;
import com.eogrenme.repository.IRepositoryCourse;
import com.eogrenme.repository.IRepositoryCourseMaterialRepository;
import com.eogrenme.repository.IRepositoryCourseVideo;
import com.eogrenme.repository.IRepositoryEnrollment; // Added import
import com.eogrenme.serviece.IServiceCourse;

@Service
public class ServiceCourse implements IServiceCourse {
/*Veritabanıyla etkileşime giren depoların bağımlılıklarını otomatik olarak enjekte
 belirli veritabanı işlemlerini işler.
 */
    @Autowired
    private IRepositoryCourse courseRepository;

    @Autowired
    private IRepositoryCategory categoryRepository;

    @Autowired
    private IRepositoryCourseMaterialRepository courseMaterialRepository;

    @Autowired
    private IRepositoryCourseVideo courseVideoRepository;

    @Autowired
    private IRepositoryEnrollment enrollmentRepository; // Added autowired repository

    @Override
    public DtoCourseUI addCourse(DtoCourseUI course ,String videoUrl) {
        if (course == null && videoUrl==null) {
            return null;
        }

        // Check if a course with the same title already exists
        Optional<Course> existingCourse = courseRepository.findByTitle(course.getTitle());
        if (existingCourse.isPresent()) {
            throw new IllegalArgumentException("A course with this title already exists");
        }

        // Yeni Course nesnesini oluştur ve temel bilgileri ayarla
        Course dbCourse = new Course();
        dbCourse.setTitle(course.getTitle());
        dbCourse.setEducationDetails(course.getEducationDetails());
        dbCourse.setDescription(course.getDescription());
        dbCourse.setPrice(course.getPrice());
        dbCourse.setImageUrl(course.getImageUrl());

        // Kursu önce kaydet ki ID oluşturulsun
        dbCourse = courseRepository.save(dbCourse);

        // Kategorileri ekle
        // Handle multiple category relationships
        if (course.getCategories() != null && !course.getCategories().isEmpty()) {
            List<Category> categories = course.getCategories().stream()
                .map(dtoCategory -> categoryRepository.findById(dtoCategory.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Karegori bulunamadı: " + dtoCategory.getId())))
                .collect(Collectors.toList());
            dbCourse.setCategories(categories);
        }

        // Materyalleri ekle (tekrar kontrolü yap)
        List<DtoCourseMaterialUI> materialDtos = course.getMaterials() != null ? course.getMaterials() : Collections.emptyList();
        for (DtoCourseMaterialUI dtoMaterial : materialDtos) {
            Optional<CourseMaterial> existingMaterial = courseMaterialRepository.findByTitleAndCourse(dtoMaterial.getTitle(), dbCourse);
            if (existingMaterial.isEmpty()) {
                CourseMaterial courseMaterial = new CourseMaterial();
                courseMaterial.setTitle(dtoMaterial.getTitle());
                courseMaterial.setType(dtoMaterial.getType());
                courseMaterial.setCourse(dbCourse);
                dbCourse.getMaterials().add(courseMaterial);
            }
        }

        // Videoları ekle (tekrar kontrolü yap)
        List<DtoVideoUI> videoDtos = course.getVideos() != null ? course.getVideos() : Collections.emptyList();
        for (DtoVideoUI dtoVideo : videoDtos) {
            Optional<Video> existingVideo = courseVideoRepository.findByUrlAndCourse(dtoVideo.getUrl(), dbCourse);
            if (existingVideo.isEmpty()) {
                Video courseVideo = new Video();
                courseVideo.setTitle(dtoVideo.getTitle());
                courseVideo.setDuration(dtoVideo.getDuration());
                courseVideo.setUrl(videoUrl);
                courseVideo.setCourse(dbCourse);
                dbCourse.getVideos().add(courseVideo);
            }
        }

        // Kursu kaydet
        dbCourse = courseRepository.save(dbCourse);

        // DTO'ya dönüştür ve döndür
        return convertToDto(dbCourse);
    }

    // Entity'den DTO'ya dönüştürme metodu
    private DtoCourseUI convertToDto(Course course) {
        DtoCourseUI dto = new DtoCourseUI();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setEducationDetails(course.getEducationDetails()); // Doğru alan    // Doğru alan
        dto.setDescription(course.getDescription());               // Doğru alan
        dto.setPrice(course.getPrice());
        dto.setImageUrl(course.getImageUrl());
    
        dto.setCategories(Optional.ofNullable(course.getCategories())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(category -> {
                    DtoCategoryUI dtoCategory = new DtoCategoryUI();
                    dtoCategory.setId(category.getId());
                    dtoCategory.setName(category.getName());
                    return dtoCategory;
                })
                .collect(Collectors.toList()));
    
        dto.setMaterials(Optional.ofNullable(course.getMaterials())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(material -> {
                    DtoCourseMaterialUI dtoMaterial = new DtoCourseMaterialUI();
                    dtoMaterial.setId(material.getId());
                    dtoMaterial.setTitle(material.getTitle());
                    dtoMaterial.setType(material.getType());
                    return dtoMaterial;
                })
                .collect(Collectors.toList()));
    
        dto.setVideos(Optional.ofNullable(course.getVideos())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(video -> {
                    DtoVideoUI dtoVideo = new DtoVideoUI();
                    dtoVideo.setId(video.getId());
                    dtoVideo.setTitle(video.getTitle());
                    dtoVideo.setDuration(video.getDuration());
                    dtoVideo.setUrl(video.getUrl());
                    return dtoVideo;
                })
                .collect(Collectors.toList()));
    
        return dto;
    }

 
    @Override
    @Transactional
    public boolean deleteCourse(Long id) {
        if (id == null) {
            return false;
        }
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isEmpty()) {
            return false;
        }
        Course course = courseOptional.get();
    
        // First, delete all enrollments associated with this course
        enrollmentRepository.deleteAllByCourseId(id);
    
        // Now delete the course
        courseRepository.delete(course);
        return true;
    }

    @Override
    public List<DtoCourseUI> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    @Override
    public DtoCourseUI getCourseById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Course> courseOptional = courseRepository.findById(id);
        return courseOptional.map(this::convertToDto).orElse(null);
    }


    @Override
    @Transactional
    public DtoCourseUI updateCourse(Long id, DtoCourseUI courseDto) {
        if (id == null || courseDto == null) {
            return null;
        }

        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isEmpty()) {
            return null;
        }

        Course existingCourse = courseOptional.get();

        // Update basic fields
        existingCourse.setTitle(courseDto.getTitle());
        existingCourse.setEducationDetails(courseDto.getEducationDetails());
        existingCourse.setDescription(courseDto.getDescription());;
        existingCourse.setPrice(courseDto.getPrice());
        if (courseDto.getImageUrl() != null) {
            existingCourse.setImageUrl(courseDto.getImageUrl());
        }

        // Update categories
        if (courseDto.getCategories() != null && !courseDto.getCategories().isEmpty()) {
            List<Category> categories = courseDto.getCategories().stream()
                .map(dtoCategory -> categoryRepository.findById(dtoCategory.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dtoCategory.getId())))
                .collect(Collectors.toList());
            existingCourse.setCategories(categories);
        }

        // Save and return
        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToDto(updatedCourse);
    }


    @Override
    public List<DtoCourseUI> searchCourses(CourseSearchCriteria criteria) {
        List<Course> courses = courseRepository.searchCourses(criteria.getCourseName(), criteria.getCategory());
        return courses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /* 
    @Override
    @Transactional
    public DtoCourseUI updateCourse(Long id, DtoCourseUI courseDto) {
        if (id == null || courseDto == null) {
            return null;
        }

        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isEmpty()) {
            return null;
        }

        Course existingCourse = courseOptional.get();

        // Update basic fields
        existingCourse.setTitle(courseDto.getTitle());
        existingCourse.setDescription(courseDto.getDescription());
        existingCourse.setPrice(courseDto.getPrice());
        if (courseDto.getImageUrl() != null) {
            existingCourse.setImageUrl(courseDto.getImageUrl());
        }

        // Update categories
        List<Category> updatedCategories = Optional.ofNullable(courseDto.getCategories())
                .orElseGet(Collections::emptyList)
                .stream()
                .map(dtoCategory -> categoryRepository.findById(dtoCategory.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Category not found: " + dtoCategory.getId())))
                .collect(Collectors.toList());
        existingCourse.setCategories(updatedCategories);

        // Update materials
        existingCourse.getMaterials().clear();
        Optional.ofNullable(courseDto.getMaterials())
                .orElseGet(Collections::emptyList)
                .forEach(materialDto -> {
                    CourseMaterial material = new CourseMaterial();
                    material.setTitle(materialDto.getTitle());
                    material.setType(materialDto.getType());
                    material.setCourse(existingCourse);
                    existingCourse.getMaterials().add(material);
                });

        // Update videos
        existingCourse.getVideos().clear();
        Optional.ofNullable(courseDto.getVideos())
                .orElseGet(Collections::emptyList)
                .forEach(videoDto -> {
                    Video video = new Video();
                    video.setTitle(videoDto.getTitle());
                    video.setDuration(videoDto.getDuration());
                    video.setUrl(videoDto.getUrl());
                    video.setCourse(existingCourse);
                    existingCourse.getVideos().add(video);
                });

        // Save and return updated course
        Course updatedCourse = courseRepository.save(existingCourse);
        return convertToDto(updatedCourse);
    }
    */
}

