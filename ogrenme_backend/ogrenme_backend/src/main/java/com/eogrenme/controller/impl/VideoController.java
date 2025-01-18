package com.eogrenme.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eogrenme.MultipartUpload.UploadFileVideoMulti;
import com.eogrenme.controller.IVideoController;
import com.eogrenme.dto.DtoVideoUI;
import com.eogrenme.serviece.IServiceVideo;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/video")

public class VideoController implements IVideoController{
    @Autowired
 private IServiceVideo serviceVideo;
    @Autowired
    ObjectMapper objectMapper;

   
    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteVideo(@PathVariable Long id) {
        boolean isDeleted = serviceVideo.deteletVideo(id);
        if (isDeleted) {
            return ResponseEntity.ok("Video deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found.");
        }
    }

    //Cours id isteniyor parametre olarak
  
    @Override
    @GetMapping("/course/{id}")
    public ResponseEntity<List<DtoVideoUI>> getVideos(@PathVariable(name="id",required=true) Long id) {
        List<DtoVideoUI> videos = serviceVideo.getVideoByCourseId(id);
        if (videos == null || videos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(videos);
    }

    @Override
    @PostMapping(value = "/add/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DtoVideoUI> addVideo(@PathVariable Long courseId,
                                               @RequestPart(value = "video") String videoJson,
                                               @RequestPart(value = "url") MultipartFile videoFile) {
        try {
            DtoVideoUI video = objectMapper.readValue(videoJson, DtoVideoUI.class);
            
            String uploadVideoUrl = UploadFileVideoMulti.uploadVideoFile(videoFile);

            DtoVideoUI dtoVideoUI = serviceVideo.addVideo(courseId, video, uploadVideoUrl);

            return ResponseEntity.ok(dtoVideoUI);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    
 
}
