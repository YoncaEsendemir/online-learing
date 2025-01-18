package com.eogrenme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoCourse {
    private Long id;
    private String title;
    private String educationDetails;
    private String description;
    private Double price;
    private String imageUrl;
      // eğitmen kimliği
  //  private DtoRole role; // Yeni DTO türü
    
}
