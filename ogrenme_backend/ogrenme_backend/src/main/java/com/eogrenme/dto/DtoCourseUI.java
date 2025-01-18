package com.eogrenme.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoCourseUI {
    private Long id;
    private String title;
    private String educationDetails;
    private String description;
    private Double price;
    private String imageUrl;
      // eğitmen kimliği
  //  private DtoRole role; // Yeni DTO türü
   @JsonProperty("categories")
    private List<DtoCategoryUI> categories;
    private List<DtoVideoUI> videos=new ArrayList<>();
    private List<DtoCourseMaterialUI> materials=new ArrayList<>();
    
}
