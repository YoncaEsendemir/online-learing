package com.eogrenme.serviece;

import java.util.List;

import com.eogrenme.dto.DtoVideoUI;


public interface IServiceVideo {

 Boolean deteletVideo(Long id);

 DtoVideoUI addVideo(Long videoId , DtoVideoUI videodto,String videoUrl);

  List <DtoVideoUI> getVideoByCourseId(Long coursId);
}
