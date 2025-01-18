package com.eogrenme.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.eogrenme.dto.DtoVideoUI;

public interface IVideoController {

    ResponseEntity<String> deleteVideo(Long id);

    // ResponseEntity<DtoVideoUI> updateVideo(Long id, DtoVideoUI materialUI);
    ResponseEntity<DtoVideoUI> addVideo(Long courseId, String videoJson,MultipartFile videoFile);

    ResponseEntity<List<DtoVideoUI>> getVideos(Long id);
}
